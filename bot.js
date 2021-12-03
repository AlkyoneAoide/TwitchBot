// "imports"
const tmi = require('tmi.js')
const WebSockets = require('./ws/index.js')

// Define configuration options
const tmiSettings = require('./channel-settings.json')
const clientSettings = require('./client-settings.json')

// Create a tmi client with our options
const tmiServer = new tmi.client(tmiSettings)
// Create separate websocket server
const wss = new WebSockets.WebSocketServer({ port:8974 })

function main() {

	// Register our event handlers (defined below) and connect
	tmiServer.on('message', onMessageHandler)
	tmiServer.on('connected', onConnectedHandler)
	tmiServer.connect()

    wss.on('connection', webSocketConnected )
}

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    // Ignore messages from the bot
    if (self) { return }

    // Remove whitespace from chat message
    const message = msg.trim()

    // instead of calling overlay() send message via websocket
    // overlay(message)
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`)
}

// Called every time there is a websocket message
function webSocketMessage(ws, data) {
    data = String(data)
    let obj = {}

    // Turn webnowplaying output into JSON
    for (const line of data.split('\n')) {
        let key = line.slice(0, line.indexOf(':')).toLowerCase()
        let value = line.slice(line.indexOf(':') + 1)
        obj[key] = value
    }

    // If the connected websocket is ready and not the server, send JSON
    wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSockets.WebSocket.OPEN) {
            client.send(JSON.stringify(obj))
            console.log(obj + " sent to " + client)
        }
    })
}

// Called every time the bot connects to a new websocket client
function webSocketConnected(ws) {
    ws.on('message', data => webSocketMessage(ws, data))
}

main()
