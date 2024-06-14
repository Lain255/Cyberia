const http = require('http')
const fs = require("fs")
const port = 8081

// Create a server object:
const server = http.createServer(function (req, res) {
    try {
        res.write(fs.readFileSync(`./${req.url}`));
        res.end();
    }
    catch (error) {
        res.write("404");
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
