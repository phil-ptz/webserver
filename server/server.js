// Packages

// body-parsser => POST-Requests verarbeiten
// fs => Speichern / Laden der Datenbank
// express-session => Speichern von Sessions in Cookies
var bodyParser = require("body-parser");
var fs = require("fs");
var session = require("express-session");

// Express initialisieren
// Express hilft beim Routing zu den verschiedenen Seiten
const express = require("express");
const app = express();

// Initialisierung der Session von express-session
app.use(session({
    secret: "1234",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Für das Parsen der POST-Daten
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

// Pfad zu den Routes
app.use(express.static(__dirname + '/../public'));
app.set("views", __dirname + "/../public/html");
app.engine('html', require('ejs').renderFile);

// Konstanten
const port = 3000; // Port 3000 (Weiterleitung von Nginx)
const dbPath = "database/user_information.json"; // Pfad zur User-Datenbank



// Funktionen

// User zur Datenbank hinzufügen
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

// Prüfen ob User in der Datenbank ist und gibt den User zurück
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

// Daten in der Datenbank speichern
function saveData(body, request) {

    var username = request.session.user.username;
  
    fs.readFile(dbPath, "utf8", (error, data) => {
        if (error) {
            console.log("Fehler beim laden der Datenbank.");
            console.log(error);
            return error;
        }
        dataObject = JSON.parse(data);
        bodyObject = JSON.parse(body);

        for (var user of dataObject) {
            if (user["username"] == username) {
                var merged = {...user, ...bodyObject}

                const index = dataObject.findIndex(user => user.username === username);
                dataObject[index] = merged;

                fs.writeFile(dbPath, JSON.stringify(dataObject), (error) => {
                    if (error) {
                        console.log("Fehler beim Speichern der Daten.");
                        console.log(error);
                        return error;
                    } else {
                        console.log("Daten erfolgreich gespeichert.");
                    }
                });
            }
        }
    });
}




// Routen

// GET-Routen
app.get("/", (request, response) => {
    response.render("index.html");
});
app.get("/login", (request, response) => {
    response.render("login.html");
});
app.get("/register", (request, response) => {
    response.render("register.html");
});
app.get("/impressum", (request, response) => {
    response.render("impressum.html");
});

// Geschützte Seiten, die nur nach Anmeldung aufgerufen werden können
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
app.get("/profile", (request, response) => {
    if (!request.session.user) {
        return response.status(403).render("denied.html");
    }
    response.render("profile.html");
});


// APIs

// Logout (Session wird gelöscht)
app.get("/logout", (request, response) => {
    request.session.destroy((err) => {
        if (err) {
            return response.status(500).send("Fehler beim Logout.");
        }
        // Weiterleitung zur Login-Seite
        response.send('<script>alert("Sie wurden ausgeloggt."); window.location.href="/login";</script>');
    });
});
// Account löschen + Logout
app.get("/delete", (request, response) => {
    if (!request.session.user) {
        return response.status(401).send("Nicht eingeloggt.");
    }

    var username = request.session.user.username;

    fs.readFile(dbPath, "utf8", (error, data) => {
        if (error) {
            console.log("Fehler beim Laden der Datenbank.");
            console.log(error);
            return response.status(500).send("Fehler beim Laden der Datenbank.");
        }
        
        let dataObject = JSON.parse(data);

        // Nutzer aus der Liste filtern
        dataObject = dataObject.filter(user => user.username !== username);

        // Aktualisierte Datenbank speichern
        fs.writeFile(dbPath, JSON.stringify(dataObject), (error) => {
            if (error) {
                console.log("Fehler beim Speichern der Daten.");
                console.log(error);
                return response.status(500).send("Fehler beim Speichern der Daten.");
            }

            console.log("Account gelöscht und Daten gespeichert.");

            // Session löschen und Weiterleitung
            request.session.destroy((err) => {
                if (err) {
                    return response.status(500).send("Fehler beim Logout.");
                }
                response.send('<script>alert("Ihr Account wurde gelöscht."); window.location.href="/login";</script>');
            });
        });
    });
});
// Prüfen ob der User eingeloggt ist + Benutzername geben
app.get("/check-login", (request, response) => {
    if (request.session.user) {
        response.json({ loggedIn: true, username: request.session.user.username });
    } else {
        response.json({ loggedIn: false });
    }
});
// Profildaten bekommen
app.get("/get-profile", (request, response) => {
    fs.readFile(dbPath, "utf8", (error, data) => {
        if (error) {
            return response.status(500).send("Fehler beim Laden der Datenbank.");
        }
        if (!request.session.user) {
            return response.status(403).send("Nicht Authorisiert.");
        }
        dataObject = JSON.parse(data);
        username = request.session.user.username;
        const index = dataObject.findIndex(user => user.username === username);
        
        response.json(dataObject[index]);
    });
});



// POST-Routen
// Login => ruft getUser() auf
app.post("/login", (request, response) => {
    var body = JSON.stringify(request.body);
    getUser(body, (error, user) => {
        if (error == null) {
            if (user) {
                request.session.user = { username: user.username };
                //response.render("index.html")
                response.send('<script>alert("Erfolgreich eingeloggt."); window.location.href="/";</script>');
            } else {
                response.status(401).send('<script>alert("Falsche Zugangsdaten."); window.location.href="/login";</script>');
            }
        } else {
            return response.status(500).send("Fehler beim Verarbeiten der Anfrage.");
        }
    });
});
// Register => ruft pushUser() auf
app.post("/register", (request, response) => {
   var body = JSON.stringify(request.body);
   var error = pushUser(body);
   if (error == null) {
        response.send('<script>alert("Sie wurden registriert, bitte melden Sie sich an."); window.location.href="/login";</script>');
   }
});
// Rechner-Daten speichern
app.post("/calculator", (request, response) => {
    var body = JSON.stringify(request.body);
    saveData(body, request)
});


// 404 Für alle anderen Routes
app.get('*', function(request, response){
    response.status(404).render('404.html');
});
// 404 Für alle anderen Routes
app.post('*', function(request, response){
    response.status(404).render('404.html');
});



// Express starten
app.listen(port, () => {
    console.log(`NodeJS-Server running on port localhost:${port}`);
});