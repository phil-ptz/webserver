// initialize express
const express = require("express");
const app = express();

app.set("views", __dirname + "/views");
app.engine('html', require('ejs').renderFile);

// constants
const port = 3000;

// routes
app.get("/", (request, response) => {
    response.render("index.html");
});

app.get("/login", (request, response) => {
    response.send("Login");
});

app.get("/signup", (request, response) => {
    response.send("SignUp");
});


// main listen
app.listen(port, () => {
    console.log(`NodeJS-Server running on port localhost:${port}`);
});