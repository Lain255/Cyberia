import fs from 'fs';
import {sha256} from 'js-sha256';
import WebSocket, {WebSocketServer} from 'ws';

class User {
    username = ""
    #socket = null

    constructor(username, socket) {
        this.username = username
        this.#socket = socket
    }

    send(data) {
        this.#socket.send(JSON.stringify(data))
    }
    logout() {
        this.#socket.close()
    }
    
    login(username, password) {
        console.log("Login attempt: " + username)
        if (!fs.existsSync('./users/' + username + '.json')) {
            throw new Error("User does not exist")
        }
        let userdata = JSON.parse(fs.readFileSync('./users/' + username + '.json'))
        if (userdata.password !== sha256([username, password].join(":"))) {
            throw new Error("Invalid password")
        }
        if (users.find(user => user.username === username)) {
            throw new Error("User already logged in")
        }

        console.log("Login successful")

        this.username = username
        this.#socket.send(JSON.stringify({app: "login", success: true}))
    }
    
    register(username, password) {
        if (fs.existsSync('./users/' + username + '.json')) {
            throw new Error("User already exists")
        }
        fs.writeFileSync(
            './users/' + username + '.json', 
            JSON.stringify({
                username, 
                password: sha256([username, password].join(":"))
            })
        )

        this.username = username        
        this.#socket.send(JSON.stringify({app: "register", success: true}))
    } 

}



class Chat {
    #subscribedUsers = []
    messages = []
    channelName = ""
    constructor(channelName) {
        this.channelName = channelName

    }

    addMessage(user, message) {
        console.log(user)
        this.messages.push({username: user.username, message})
        this.#subscribedUsers.forEach(_user => {
            _user.send({app: "new message", username: user.username, message})
        });
        console.log(this.messages)
    }
    getMessages(user) {
        user.send({app: "chat history", messages: this.messages})
    }
    subscribe(user) {
        this.#subscribedUsers.push(user)
    }
}

let globalChat = new Chat("global chat")
let users = []


const wss = new WebSocketServer({ noServer: true});
wss.on('connection', (ws) => {
    let user = new User("guest", ws)
    users.push(user)
    globalChat.subscribe(user)


    ws.on('message', (event) => {
        try {
            let data = JSON.parse(event);
            console.log(data)

            if (data.app === "login") {
                user.login(data.username, data.password)
            }
            if (data.app === "register") {
                user.register(data.username, data.password)
            }
            if (data.app === "getchat") {
                globalChat.getMessages(user)
            }
            if (data.app === "sendmessage") {
                globalChat.addMessage(user, data.message)
            }
    
        } catch (error) {
            user.send({app: "error", message: error.message})
        }
    });
});
  

// Create a server object:
import http from 'http';
import { error } from 'console';
const port = 8080
const server = http.createServer(function (req, res) {
    try {
        if (req.url.split(".").at(-1) === "js") {
            res.setHeader("Content-Type", 'text/javascript');
        }

        if (req.url === "/") {
            res.write(fs.readFileSync("./home.html"))
        }
        else {
            res.write(fs.readFileSync(`./${req.url}`));
        }
        res.end();

        
    }
    catch (error) {
        console.log(req.url);

        console.log(error)
        res.write("404");
        res.end();
    }
})

server.on('upgrade', function upgrade(request, socket, head) {
    console.log('Parsing websocket request...');
    wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
    });
});

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

