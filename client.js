let document = globalThis.document;

let socket = new WebSocket(window.location.origin);
socket.onmessage = (event) => {
    try { 
        let data = JSON.parse(event.data);
        console.log(data)
        if (data.app === "login") {
            if (data.success) {
                document.getElementById("login").style.display = "none";
                document.getElementById("register").style.display = "none";
                document.getElementById("chat").style.display = "block";
            } else {
                alert("Login failed");
            }
        }
        if (data.app === "register") {
            if (data.success) {
                document.getElementById("login").style.display = "none";
                document.getElementById("register").style.display = "none";
                document.getElementById("chat").style.display = "block";
            } else {
                alert("Register failed");
            }
        }

        if (data.app === "new message") {
            let messages = document.getElementById("messages");
            let message = document.createElement("p");
            message.innerText = data.username + " : " + data.message;
            messages.appendChild(message);
            messages.scrollTop = messages.scrollHeight;

        }
        if (data.app === "chat history") {
            let messages = document.getElementById("messages");
            messages.innerHTML = "";
            data.messages.forEach(message => {
                let messageElement = document.createElement("p");
                messageElement.innerText = message.username + " : " + message.message;
                messages.appendChild(messageElement);
            });
            messages.scrollTop = messages.scrollHeight;
        }
        if (data.app === "error") {
            alert(data.message);
        }
        
            
        console.log(data);

    } catch (error) {
        console.log("Error parsing JSON: " + error);
    }
}
socket.onopen = (event) => {
    console.log("Connection established");
    getChatHistory();

}
socket.onclose = (event) => {
    console.log("Connection closed");
    location.reload()
}    
socket.onerror = (event) => {
    console.log("Error: " + event);
}

let login = () => {
    let username = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;
    socket.send(JSON.stringify({app: "login", username, password}));
    
}

let register = () => {
    let username = document.getElementById("register-username").value;
    let password = document.getElementById("register-password").value;
    socket.send(JSON.stringify({app: "register", username, password}));

}

let sendMessage = () => {
    let message = document.getElementById("message").value;
    socket.send(JSON.stringify({app: "sendmessage", message}));
    document.getElementById("message").value = "";
}

let getChatHistory = () => {
    socket.send(JSON.stringify({app: "getchat"}));
}

globalThis.sendMessage = sendMessage;
globalThis.login = login;
globalThis.register = register;

