var express = require("express");
var app = express();
var path = require('path');
var cors = require('cors');

app.use(cors())

app.use("/", express.static(path.join(__dirname, "dist")));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

var port = 4200;
app.listen(port, function () {
    console.log("Connected on port 4200");
})