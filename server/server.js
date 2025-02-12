// initialize express
const express = require("express");
const app = express();

app.use(express.static(__dirname + '/../public'));
app.set("views", __dirname + "/../public/html");
app.engine('html', require('ejs').renderFile);

// constants
const port = 3000;

// routes
app.get("/", (request, response) => {
    response.render("index.html");
});

app.get("/login", (request, response) => {
    response.render("login.html");
});

app.get("/signup", (request, response) => {
    response.send("SignUp");
});


// main listen
app.listen(port, () => {
    console.log(`NodeJS-Server running on port localhost:${port}`);
});