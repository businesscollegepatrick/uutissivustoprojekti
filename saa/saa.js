const express = require('express');
const {XMLBuilder, XMLParser, XMLValidator} = require('fast-xml-parser');
const mysql = require('mysql2')
const dbconfig = require('./dbconfig.json')

const app = express();

const port = 3001;

app.set('view engine', 'ejs');  // Add this to specify that you're using EJS
app.set('views', './views');    // Set the path where your EJS files are located (if they are inside a 'views' folder)


app.get('/saa/viikko/:vko', async (req, res) => {
  const viikkonro = req.params.vko;
  //tietokantakysely: kysy viikkonro mukaiset säätiedot
  const connection = mysql.createConnection(dbconfig);
  connection.connect();
  connection.query("SELECT * FROM saa WHERE vko =?",[viikkonro] ,
    (err, rivit, kentat) => {  
      if (err) {
        throw err;
      }

        //const weatherData = rivit; // Store fetched weather data
        
        // Render the EJS template and pass the weatherData to the template
        //res.render('index', { news: [], weather: weatherData });

       //xmlbuilder (rakentaja)
  const rakentaja = new XMLBuilder({
    arrayNodeName: 'paiva'
});

  //vaihda ruokalista tietokantakyselyn tulokseen
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <saa>
        ${rakentaja.build(rivit)}
    </saa>`;

    // aseta Content-Type, jotta selain ymmärtää sivun oikein
    res.set('Content-Type', 'text/xml');
    res.send(xml);
    });
  connection.end();

 
});

app.listen(port, () => {
    console.log(`Palvelin osoitteessa on http://localhost:${port}`);
});