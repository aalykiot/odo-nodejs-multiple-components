const express = require('express');
const fetch = require('node-fetch');

const app = express();

const host = 'localhost';
const hostPort = 8080;

app.get('/', (req, res) => {
  fetch(`http://${host}:${hostPort}/api/message`)
    .then(res => res.json())
    .then(({ message }) => {
      res.contentType('text/html');
      res.send(`
        <h3>Message from the server</h3>
        <h1>${message}</h1>
      `);
    })
    .catch(() => {
      res.contentType('text/html');
      res.send('<h1>Can\'t connect with backend service</h1>');
    });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Frontend service listening on port ${port}`);
});
