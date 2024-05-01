var express = require("express");
var path = require("path");

var sqlite3 = require("sqlite3").verbose();
var bodyParser = require("body-parser");
var session = require('express-session');

var app = express();

app.use(session({
    secret: 'dbfyhdfbrgiwrifg',
    resave: false,
    saveUninitialized: false
  }));

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use("/",require("./routes/web"));
app.use("/api",require("./routes/api"));


app.listen(app.get("port"), function(){
    console.log("Server started on port " + app.get("port"));
})