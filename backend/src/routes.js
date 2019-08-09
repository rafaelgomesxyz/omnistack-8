const express = require('express');

const DevController = require('./controllers/DevController');
const LikeController = require('./controllers/LikeController');
const DislikeControlller = require('./controllers/DislikeController');
const MatchController = require('./controllers/MatchController');

const routes = express.Router();

routes.get(`/devs`, DevController.index);
routes.get(`/devs/:devId`, DevController.show);
routes.post(`/devs`, DevController.store);

routes.post(`/devs/:targetId/likes`, LikeController.store);
routes.post(`/devs/:targetId/dislikes`, DislikeControlller.store);

routes.delete(`/devs/matches`, MatchController.delete);

module.exports = routes;