const express = require('express');
const cors = require('cors');
const res = require('express/lib/response');
const puzzles = require('./puzzles');

class Server {
  constructor() {
    this.app = express();
    this.port = 8080;

    this.middlewares();

    this.app.get('/new-problem', (req, res) => {
      res.json({ puzzle: puzzles.random() })
    });
  }

  middlewares() {
    this.app.use(cors());
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Server running at ' + this.port);
    });
  }
}

module.exports = Server;