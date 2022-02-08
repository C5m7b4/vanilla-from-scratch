const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const data = require('./data');

app.get('/', (req, res) => {
  res.send({ error: 0, success: true, data });
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
