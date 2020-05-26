const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.contentType('text/html');
  res.send('<h1>Node.js Backend Service!</h1>')
});

app.get('/api/message', (req, res) => {
  res.send({
    message: 'This is a message from the API service',
  });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Backend service listening on port ${port}`);
});
