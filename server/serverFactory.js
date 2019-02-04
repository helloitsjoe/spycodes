const express = require('express');
const path = require('path');
const ip = require('ip');

const makeServer = (host = 'localhost', port = 3000) => {
  const app = express();

  app.use(express.static(path.join(__dirname, '..')));

  app.get('/spymaster', (req, res) => {
    res.sendFile(path.join(__dirname, '../spymaster.html'));
  });

  app.get('/', (req, res) => {
    res.sendFile('index.html');
  });

  app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
    console.log(`Listening on http://${ip.address()}:${port}`);
  });

  return app;
};

module.exports = {
  makeServer,
};
