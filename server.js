
const http = require('http')
const fs = require("fs")
const port = 8080

const {WebSocketServer} = require('ws');
const wss = new WebSocketServer({ port: 8081 });


// Create a server object:
const server = http.createServer(function (req, res) {
    console.log(req.url);
    try {
        if (req.url == "/") {
            res.write(fs.readFileSync("./home.html"))
        }
        else {
            res.write(fs.readFileSync(`./${req.url}`));
        }
        res.end();
    }
    catch (error) {
        console.log(error)
        res.write("404");
        res.end();
    }
})

// Set up our server so it will listen on the port
server.listen(port, function (error) {

    // Checking any error occur while listening on port
    if (error) {
        console.log('Something went wrong', error);
    }
    // Else sent message of listening
    else {
        console.log('Server is listening on port' + port);
    }
})

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });
  
    ws.send('something');
});
  