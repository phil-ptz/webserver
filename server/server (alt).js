const http = require("http");
const qs = require("querystring");
const fs = require("fs").promises;

const host = "localhost";
const port = 8000;

function postData(request, callback) {
	var body = '';
	request.on('data', function (data) {
		body += data;
		// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
		if (body.length > 1e6) { 
			// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
			request.connection.destroy();
		}
	});
	request.on('end', function () {
		var POST = qs.parse(body);
    	callback(POST);
	});
}

function loadSite(response, file) {
	fs.readFile(__dirname + "/" + file)
        .then(contents => {
            response.setHeader("Content-Type", "text/html");
            response.writeHead(200);
            response.end(contents);
        })
        .catch(err => {
            response.writeHead(500);
            response.end(err);
            return;
        });
}

const listener = function (request, response) {

	console.log(`${request.method} Request von ${request.socket.remoteAddress} auf ${request.url}`)

	if (request.method === "GET") {
		switch (request.url) {
			case "/":
				loadSite(response, "index.html")
				break
			case "/login":
				loadSite(response, "login.html")
				break
			default:
				response.writeHead(404);
				response.end(JSON.stringify({error: "Seite nicht gefunden."}));
		}
	} else if (request.method === "POST") {
		switch (request.url) {
			case "/":
				response.writeHead(200);
				response.end("Nicht implementiert.")
				break
			case "/login":
				postData(request, function(POST) {
					console.log(POST);  // Do something with the parsed POST data
					response.writeHead(200, { 'Content-Type': 'text/plain' });
					response.end('Data received');
				});
				break
			default:
				response.writeHead(404);
				response.end(JSON.stringify({error: "Seite nicht gefunden."}));
		}
	}
};

const server = http.createServer(listener);
server.listen(port, host, () => {
	console.log(`Server running on http://${host}:${port}`);
});
