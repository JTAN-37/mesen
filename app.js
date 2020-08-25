const express = require("express");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

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
      const article = newsData.articles[0];

      const articleAuthor = article.author;
      const articleTitle = article.title;
      const articleDesc = article.description;

      res.set("Content-Type", "text/html");

      res.write('<h2>' + articleAuthor + '</h2>');
      res.write('<h2>' + articleTitle + '</h2>');
      res.write('<h2>' + articleDesc + '</h2>');
      res.send();
    });

  });
});

app.listen("3000", function(req, res) {
  console.log("Server is running on port 3000");
});
