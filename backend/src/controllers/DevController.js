const axios = require('axios');

const Dev = require('../models/Dev');

module.exports = {
  async index(req, res) {
    const { logged_id: loggedId } = req.headers;
    const { devIds } = req.body;

    const filters = {};

    if (loggedId) {
      const loggedDev = await Dev.findById(loggedId);

      if (!loggedDev) {
        return res.status(400).json({ error: 'Logged dev not exists' });
      }

      filters['$and'] = [
        { _id: { $ne: loggedId } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } }
      ];

      if (loggedDev.matches.length > 0) {
        const loggedSocket = req.connectedUsers[loggedId];

        if (loggedSocket) {
          const matchDevs = await Dev.find({
            '$and': [
              { _id: { $in: loggedDev.matches} }
            ]
          });

          req.io.to(loggedSocket).emit('matches', matchDevs);

          loggedDev.matches = [];
          
          await loggedDev.save();
        }
      }
    } else if (devIds) {
      filters['$and'] = [
        { _id: { $in: devIds } }
      ];
    }

    const devs = await Dev.find(filters);

    return res.json(devs);
  },

  async show(req, res) {
    const { devId } = req.params;

    const dev = await Dev.findById(devId);

    if (!dev) {
      return res.status(400).json({ error: 'Dev not exists' });
    }

    return res.json(dev);
  },

  async store(req, res) {
    const { username } = req.body;

    let dev = await Dev.findOne({ username });

    if (!dev) {
      try {
        const response = await axios.get(`https://api.github.com/users/${username}`);

        const { avatar_url: avatar, name, bio } = response.data;

        dev = await Dev.create({ username, avatar, name, bio });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    return res.json(dev);
  },
};