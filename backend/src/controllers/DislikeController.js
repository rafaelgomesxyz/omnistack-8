const Dev = require('../models/Dev');

module.exports = {
  async store(req, res) {
    const { logged_id: loggedId } = req.headers;
    const { targetId } = req.params;

    const loggedDev = await Dev.findById(loggedId);
    const targetDev = await Dev.findById(targetId);

    if (!loggedDev) {
      return res.status(400).json({ error: 'Logged dev not exists' });
    }

    if (!targetDev) {
      return res.status(400).json({ error: 'Target dev not exists' });
    }

    if (loggedDev.dislikes.includes(targetId)) {
      loggedDev.dislikes = loggedDev.dislikes.filter(id => id != targetId);
    } else {
      if (loggedDev.likes.includes(targetId)) {
        loggedDev.likes = loggedDev.likes.filter(id => id != targetId);
      }

      loggedDev.dislikes.push(targetId);
    }

    await loggedDev.save();

    return res.json(loggedDev);
  },
};