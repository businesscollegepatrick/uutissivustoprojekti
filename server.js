const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const fetch = require('node-fetch')
const { XMLParser } = require('fast-xml-parser')
const dbconfig = require('./dbconfig.json')

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
const port = 3000;

/*app.use('/inc', express.static('includes'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'templates/index.html')));*/

app.get('/api/uutiset', (req, res) => {
    const connection = mysql.createConnection(dbconfig);
  connection.connect();
  connection.query("SELECT * FROM uutiset",
    (err, rivit, kentat) => {  
      if (err) {
        throw err;
      }
      res.json(rivit);
    });
  connection.end();
});

app.get('/', async (req, res) => {

  try {
    const uutiset = await fetch('http://localhost:3000/api/uutiset');
    const uutisdata = await uutiset.json();
    console.log(uutisdata); /* laittaa terminaliin */

    const saahaku = await fetch('http://localhost:3001/saa/viikko/1')
    const saaXML = await saahaku.text();

    const blogit = await fetch('http://localhost:3002/api/blogi')
    const blogidata = await blogit.json();
    console.log(blogidata);

    const parser = new XMLParser({ ignoreAttributes: false});
    const saadata = parser.parse(saaXML);
    console.log(saadata.saaviikko);

    res.render('index', { news: uutisdata, weatherData: saadata, blogi: blogidata});
  }  catch (error) {
    console.error('Virhe tietojen haussa:', error.message);
  res.status(500).json({ error: 'Virhe tietojen haussa'});
  }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});