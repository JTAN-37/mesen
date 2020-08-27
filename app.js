const express = require("express");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");
const iso = require(__dirname + "/iso.js");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view-engine', 'ejs');

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {

  const country = req.body.countryName;
  const apiKey = '4e2984a446b04bd79463b098b4708b07';

  const url = 'https://newsapi.org/v2/top-headlines?country=' + country + '&apiKey=' + apiKey;

  https.get(url, function(response) {

    let rawData = '';

    response.on("data", function(dataChunk) {
      rawData += dataChunk;
    });

    response.on('end', function() {
      const newsData = JSON.parse(rawData);


      var articles = [];

      for (var i = 0; i < newsData.articles.length; i++) {
        articles.push(newsData.articles[i]);
      }

      res.render('results.ejs', {
        articles: articles,
        isoCodes: iso.isoCodes,
        countryISO: country
      });
    });

  });
});

app.listen("3000", function(req, res) {
  console.log("Server is running on port 3000");
});
