const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const routes = require('./routes');

const connectedUsers = {};

io.on('connection', socket => {
  const { loggedId } = socket.handshake.query;

  connectedUsers[loggedId] = socket.id;

  socket.on('disconnect', () => delete connectedUsers[loggedId]);
});

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-xbtdb.mongodb.net/omnistack8?retryWrites=true&w=majority', {
  useNewUrlParser: true
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);