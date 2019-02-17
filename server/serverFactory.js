const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');
const ip = require('ip');
const { makeCards } = require('./cardData');

const makeServer = (host = 'localhost', port = 3000) => {
  const app = express();
  const httpServer = http.createServer(app);
  const io = socketIO(httpServer, { serveClient: false });

  const cards = makeCards();

  app.use(express.static(path.join(__dirname, '..')));

  app.get('/spymaster', (req, res) => {
    res.sendFile(path.join(__dirname, '../spymaster.html'));
  });

  app.get('/', (req, res) => {
    res.sendFile('index.html');
  });

  io.on('connection', socket => {
    console.log(`A new user connected!`);
    socket.emit('card-data', cards);
    socket.on('card-clicked', id => {
      socket.broadcast.emit('card-clicked', id);
    });
    socket.on('request-cards', () => {
      socket.emit('card-data', cards);
    });
    socket.on('disconnect', () => {
      console.log(`A player disconnected...`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Listening on http://${host}:${port}`);
    console.log(`Listening on http://${ip.address()}:${port}`);
  });

  return httpServer;
};

module.exports = {
  makeServer,
};
