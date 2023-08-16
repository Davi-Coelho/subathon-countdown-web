let wss = null
const { Server } = require('socket.io')
 
function onMessage(ws, data) {
    console.log(`${ws.channel} ${data}`)
}
 
function onConnection(ws) {
    ws.channel = ws.handshake.query['channel']
    ws.on('message', data => onMessage(ws, data))
}
 
module.exports = (server) => {
    wss = new Server(server)
 
    wss.on('connection', onConnection)
 
    console.log(`App Web Socket Server is running!`)
    return wss
}
