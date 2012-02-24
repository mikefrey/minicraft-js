var port = process.env.PORT || 8080;

var express = require('express');
var app = express.createServer();

app.configure('development', 'production', function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


app.get('/', function(req, res){
    res.sendfile('views/index.html');
});

app.listen(port);