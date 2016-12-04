var port = process.env.PORT || 8080;

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  console.log(req.path)
  next()
});

app.get('/', function(req, res){
    res.sendFile('views/index.html');
});

app.listen(port);
