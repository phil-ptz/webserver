// imports
var bodyParser = require("body-parser");
var fs = require("fs");

// initialize express
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.static(__dirname + '/../public'));
app.set("views", __dirname + "/../public/html");
app.engine('html', require('ejs').renderFile);

// constants
const port = 5500;
const dbPath = "../database/user_information.json";

// functions
function pushUser (user) {

    fs.readFile(dbPath, "utf8", (error, data) => {
        if (error) {
            console.log("Fehler beim laden der Datenbank.");
            console.log(error);
            return error;
        }
        dataObject = JSON.parse(data);
        userObject = JSON.parse(user);
        dataObject.push(userObject);
        fs.writeFile(dbPath, JSON.stringify(dataObject), (error) => {
        if (error) {
            console.log("Fehler beim Speichern der Daten.");
            console.log(error);
            return error;
        } else {
            console.log("Daten erfolgreich gespeichert.");
        }
    });
    })
}

// routes
app.get("/", (request, response) => {
    response.render("index.html");
});
app.get("/login", (request, response) => {
    response.render("login.html");
});

app.post("/", (request, response) => {
    response.render("index.html");
});
app.post("/login", (request, response) => {
   var body = JSON.stringify(request.body);
   var error = pushUser(body);
   if (error == null) {
        response.send("Daten wurden gesendet.");
   }
});

// main listen
app.listen(port, () => {
    console.log(`NodeJS-Server running on port localhost:${port}`);
});