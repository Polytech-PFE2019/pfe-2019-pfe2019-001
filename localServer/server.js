var express = require("express");
var path = require("path");
var app = express();

app.get('*', function(req, res) {
  res.sendfile('./dist/webApp/index.html')
});

var port = 1337;
app.listen(port, function(){
	console.log("Connected on port 1337");
})