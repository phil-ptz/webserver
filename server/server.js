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

// Initialisierung der Session mit Cookie von express-session
app.use(session({
    secret: "1234",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false , maxAge: 30*60*1000} // Cookie wird nicht verschlüsselt und hat eine Dauer von 30 Minuten
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

    // Datenbank auslesen
    fs.readFile(dbPath, "utf8", (error, data) => {
        // Error-Handling
        if (error) {
            return error;
        }

        // Daten parsen
        dataObject = JSON.parse(data);
        userObject = JSON.parse(user);

        // User hinzufügen ohne das conifirmed Password
        delete userObject["confirm_password"]
        dataObject.push(userObject);

        // Datenbank wieder speichern
        fs.writeFile(dbPath, JSON.stringify(dataObject), (error) => {
            // Error-Handling
            if (error) {
                return error;
            }
        });
    });

    // Kein Error => Neue Daten erfolgreich gespeichert
}

// Prüfen ob User in der Datenbank ist und gibt den User zurück
function getUser (user, callback) {

    // Datenbank auslesen
    fs.readFile(dbPath, "utf8", (error, data) => {
        // Error-Handling
        if (error) {
            return callback(error);
        }

        // Daten paresen
        dataObject = JSON.parse(data);
        userObject = JSON.parse(user);

        // Suche nach Benutznamen und Passwort in Datenbank
        let found = null;
        for (const savedUser of dataObject) {
            if (savedUser["username"] == userObject["username"] && savedUser["password"] == userObject["password"]) {
                found = savedUser;
            }
        }

        // Gefunden Benutzernamen zurückgeben oder null wenn nicht gefunden
        // Als Callback, um das Programm nicht zu blockieren
        callback(null, found);
    });
}

// Daten aus Rechnern in der Datenbank speichern
function saveData(body, request) {

    // Benutzername aus Session holen
    var username = request.session.user.username;
  
    // Datenbank auslesen
    fs.readFile(dbPath, "utf8", (error, data) => {
        // Error-Handling
        if (error) {
            return error;
        }

        // Daten parsen
        dataObject = JSON.parse(data);
        bodyObject = JSON.parse(body);

        // Nach User in Datenbank suchen
        for (var user of dataObject) {
            if (user["username"] == username) {

                // Daten zur Datenbank hinzufügen
                var merged = {...user, ...bodyObject}
                const index = dataObject.findIndex(user => user.username === username);
                dataObject[index] = merged;

                // Datenbank speichern
                fs.writeFile(dbPath, JSON.stringify(dataObject), (error) => {
                    if (error) {
                        return error;
                    }
                });
            }
        }
    });

    // Kein Error => Daten wurden erfolgreich gespeichert
}

// User aus der Datenbank löschen
function deleteUser(username) {

    // Datenbank laden
    fs.readFile(dbPath, "utf8", (error, data) => {
        if (error) {
            return error;
        }
        
        // Daten parsen
        let dataObject = JSON.parse(data);

        // User aus der Liste filtern
        dataObject = dataObject.filter(user => user.username !== username);

        // Aktualisierte Datenbank speichern
        fs.writeFile(dbPath, JSON.stringify(dataObject), (error) => {
            if (error) {
                return error;
            }
        });
    });

    // Kein Error => Account wurde gelöscht
}



// Routen

// GET-Routen
app.get("/", (request, response) => {
    // Leite Benutzer zur Menu.html wenn wer angemeldet ist
    if (!request.session.user) {
        response.render("index.html");
    } else {
        response.render("Menu.html");
    }
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
// Es wird nach aktiven Session geprüft
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
app.get("/menu", (request, response) => {
    if (!request.session.user) {
        return response.status(403).render("denied.html");
    }
    response.render("Menu.html");
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

    // Benutzername aus Session holen
    var username = request.session.user.username;

    // User löschen
    var error = deleteUser(username);
    if (error) {
        response.status(500).send("Es konnte nicht auf die Datenbank zugegriffen werden.");
    }

    // Session löschen
    request.session.destroy((error) => {
        if (error) {
            response.status(500).send("Fehler beim löschen der Session.");
        } else {
            response.status(200).send(); // Weiterleitung erfolgt im Client-Script
        }
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
// Profildaten bekommen (für profile.html)
app.get("/get-profile", (request, response) => {
    // Datenbank auslesen
    fs.readFile(dbPath, "utf8", (error, data) => {
        if (error) {
            return response.status(500).send("Fehler beim Laden der Datenbank.");
        }
        // Nicht angemeldet
        if (!request.session.user) {
            return response.status(403).send("Nicht Authorisiert.");
        }
        // Daten parsen und Benutzer herausfiltern
        dataObject = JSON.parse(data);
        username = request.session.user.username;
        const index = dataObject.findIndex(user => user.username === username);
        
        // Daten in Response als json
        response.json(dataObject[index]);
    });
});



// POST-Routen
// Login => ruft getUser() auf
app.post("/login", (request, response) => {

    // Request Body stringifizieren
    var body = JSON.stringify(request.body);
    getUser(body, (error, user) => {
        if (error == null) {
            if (user) {
                // User in session speichern
                request.session.user = { username: user.username };
                // Weiterleitung zu /menu mit alert 
                response.send('<script>alert("Erfolgreich eingeloggt."); window.location.href="/menu";</script>');
            } else {
                // Fehler wenn falsche Zugangsdaten eingegeben
                response.status(401).send('<script>alert("Falsche Zugangsdaten."); window.location.href="/login";</script>');
            }
        } else {
            // Datenbank Fehler
            return response.status(500).send("Fehler beim Verarbeiten der Anfrage.");
        }
    });
});
// Register => ruft pushUser() auf
app.post("/register", (request, response) => {

    // Request Body stringifizieren
   var body = JSON.stringify(request.body);

   // User zur Datenbank hinzufügen
   var error = pushUser(body);

   // Weiterleitung zu /login
   if (error == null) {
        response.send('<script>alert("Sie wurden registriert, bitte melden Sie sich an."); window.location.href="/login";</script>');
   } else {
        // Datenbank Fehler
        return response.status(500).send("Fehler beim Verarbeiten der Anfrage.");
   }
});
// Rechner-Daten speichern
app.post("/calculator", (request, response) => {
    var body = JSON.stringify(request.body);
    saveData(body, request)
});


// Error-Seite Für alle anderen Routes
app.get('*', function(request, response){
    response.status(404).render('404.html');
});
app.post('*', function(request, response){
    response.status(404).render('404.html');
});



// Express starten
app.listen(port, () => {
    console.log(`NodeJS-Server running on port localhost:${port}`);
});