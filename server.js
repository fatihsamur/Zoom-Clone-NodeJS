const express = require('express');
const app = express();
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const server = http.createServer(app);
app.set('view engine', 'ejs');
app.use(express.static('public'));

const port = 3000;

app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
