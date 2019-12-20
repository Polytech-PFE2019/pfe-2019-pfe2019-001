var express = require("express");
var path = require('path');
var cors = require('cors');
var app = express();

app.use(cors())
app.use("/", express.static(path.join(__dirname, "dist")));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

module.exports = app