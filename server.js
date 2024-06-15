const http = require('http')
const fs = require("fs")
const port = 8080

// Create a server object:
const server = http.createServer(function (req, res) {
    console.log(req.url);
    try {
        if (req.url == "/") {
            res.write(fs.readFileSync("./index.html"))
        }
        res.write(fs.readFileSync(`./${req.url}`));
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
