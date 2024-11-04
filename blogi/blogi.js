const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const fetch = require('node-fetch')
const { XMLParser } = require('fast-xml-parser')
const dbconfig = require('./dbconfig.json')

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
const port = 3002;


app.get('/api/blogi', (req, res) => {
    const connection = mysql.createConnection(dbconfig);
  connection.connect();
  connection.query("SELECT * FROM blogi",
    (err, rivit, kentat) => {  
      if (err) {
        throw err;
      }
      res.json(rivit);
    });
  connection.end();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});