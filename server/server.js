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
const port = 3000;
const dbPath = "database/user_information.json";

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
        delete userObject["confirm_password"]
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

function getUser (user, callback) {

    fs.readFile(dbPath, "utf8", (error, data) => {
        if (error) {
            console.log("Fehler beim laden der Datenbank.");
            console.log(error);
            return callback(error);
        }

        dataObject = JSON.parse(data);
        userObject = JSON.parse(user);

        let found = false;
        for (const savedUser of dataObject) {
            if (savedUser["username"] == userObject["username"] && savedUser["password"] == userObject["password"]) {
                found = true;
            }
        }

        callback(null, found);
    });

}

// get routes
app.get("/", (request, response) => {
    response.render("index.html");
});
app.get("/login", (request, response) => {
    response.render("login.html");
});
app.get("/register", (request, response) => {
    response.render("register.html");
});
app.get("/calculator", (request, response) => {
    response.render("calculator.html");
});
app.get("/training", (request, response) => {
    response.render("trainingsplan.html");
});
app.get("/impressum", (request, response) => {
    response.render("impressum.html");
});

// post routes
app.post("/", (request, response) => {
    response.render("404.html");
});
app.post("/login", (request, response) => {
    var body = JSON.stringify(request.body);
    getUser(body, (error, result) => {
        if (error == null) {
            if (result) {
                response.send("Sie sind angemeldet.");
            } else {
                response.send("Falsche Zugangsdaten.")
            }
        }
    });
});
app.get("/calculator", (request, response) => {
    response.render("404.html");
});
app.get("/impressum", (request, response) => {
    response.render("404.html");
});
app.get("/training", (request, response) => {
    response.render("404.html");
});
app.post("/register", (request, response) => {
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