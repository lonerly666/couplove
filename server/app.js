const express = require('express');
const bodyParser = require('body-parser');
const CLIENT_URL = "http://localhost:3000";
const cors = require("cors");
const app = express();
const port = 5000;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(
    cors({
      origin: CLIENT_URL,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true
    })
);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})