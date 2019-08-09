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

    if (loggedDev.likes.includes(targetId)) {
      loggedDev.likes = loggedDev.likes.filter(id => id != targetId);
    } else {
      if (loggedDev.dislikes.includes(targetId)) {
        loggedDev.dislikes = loggedDev.dislikes.filter(id => id != targetId);
      }

      loggedDev.likes.push(targetId);

      if (targetDev.likes.includes(loggedId)) {
        const loggedSocket = req.connectedUsers[loggedId];
        const targetSocket = req.connectedUsers[targetId];

        if (loggedSocket) {
          req.io.to(loggedSocket).emit('match', targetDev);
        } else if (!loggedDev.matches.includes(targetId)) {
          loggedDev.matches.push(targetId);
        }

        if (targetSocket) {
          req.io.to(targetSocket).emit('match', loggedDev);
        } else if (!targetDev.matches.includes(targetId)) {
          targetDev.matches.push(loggedId);
        }
      }
    }

    await Promise.all([
      loggedDev.save(),
      targetDev.save()
    ]);

    return res.json(loggedDev);
  },
};