const Dev = require('../models/Dev');

module.exports = {
  async delete(req, res) {
    const { logged_id: loggedId } = req.headers;

    const loggedDev = await Dev.findById(loggedId);

    if (!loggedDev) {
      return res.status(400).json({ error: 'Logged dev not exists' });
    }

    loggedDev.matches = [];

    await loggedDev.save();

    return res.json(loggedDev);
  },
};