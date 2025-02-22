// imports
var bodyParser = require("body-parser");
var fs = require("fs");
var session = require("express-session");

// initialize express
const express = require("express");
const app = express();
app.use(session({
    secret: "1234",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// for parsing
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

// view paths
app.use(express.static(__dirname + '/../public'));
app.set("views", __dirname + "/../public/html");
app.engine('html', require('ejs').renderFile);

// constants
const port = 3000;
const dbPath = "database/user_information.json";

// functions

// adds user to db
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

// check if user is in db
function getUser (user, callback) {

    fs.readFile(dbPath, "utf8", (error, data) => {
        if (error) {
            console.log("Fehler beim laden der Datenbank.");
            console.log(error);
            return callback(error);
        }

        dataObject = JSON.parse(data);
        userObject = JSON.parse(user);

        let found = null;
        for (const savedUser of dataObject) {
            if (savedUser["username"] == userObject["username"] && savedUser["password"] == userObject["password"]) {
                found = savedUser;
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
app.get("/logout", (request, response) => {
    request.session.destroy((err) => {
        if (err) {
            return response.status(500).send("Fehler beim Logout.");
        }
        response.send('<script>alert("Sie wurden ausgeloggt."); window.location.href="/login";</script>');
    });
});
app.get("/calculator", (request, response) => {
    if (!request.session.user) {
        return response.status(403).render("denied.html");
    }
    response.render("calculator.html");
});
app.get("/training", (request, response) => {
    if (!request.session.user) {
        return response.status(403).render("denied.html");
    }
    response.render("trainingsplan.html");
});
app.get("/impressum", (request, response) => {
    response.render("impressum.html");
});
app.get("/profile", (request, response) => {
    if (!request.session.user) {
        return response.status(403).render("denied.html");
    }
    response.render("profile.html");
});
app.get("/check-login", (request, response) => {
    console.log(request.session, request.session.user)
    if (request.session.user) {
        response.json({ loggedIn: true, username: request.session.user.username });
    } else {
        response.json({ loggedIn: false });
    }
});

// post routes
app.post("/", (request, response) => {
    response.render("404.html");
});
app.post("/login", (request, response) => {
    var body = JSON.stringify(request.body);
    getUser(body, (error, user) => {
        if (error == null) {
            if (user) {
                request.session.user = { username: user.username };
                //response.render("index.html")
                response.send('<script>alert("Erfolgreich eingeloggt."); window.location.href="/";</script>');
            } else {
                response.status(401).send("Falsche Zugangsdaten.");
            }
        } else {
            return response.status(500).send("Fehler beim Verarbeiten der Anfrage.");
        }
    });
});
app.post("/register", (request, response) => {
   var body = JSON.stringify(request.body);
   var error = pushUser(body);
   if (error == null) {
        response.send('<script>alert("Sie wurden registriert, bitte melden Sie sich an."); window.location.href="/login";</script>');
   }
});


// main listen
app.listen(port, () => {
    console.log(`NodeJS-Server running on port localhost:${port}`);
});
