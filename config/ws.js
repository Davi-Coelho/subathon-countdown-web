let wss = null
const { Server } = require('socket.io')
const { createAdapter } = require('@socket.io/redis-adapter')
const { createClient } = require('redis')
 
function onMessage(ws, data) {
    console.log(`${ws.channel} ${data}`)
}
 
function onConnection(ws) {
    const channel = ws.handshake.query['channel']
    ws.join(channel)
    ws.on('message', data => onMessage(ws, data))
}
 
module.exports = (server) => {
    wss = new Server(server)

    const pubClient = createClient({ url: 'redis://redis-0.redis:6379'})
    const subClient = pubClient.duplicate()

    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
        wss.adapter(createAdapter(pubClient, subClient))
        wss.listen(3000)
    })
 
    wss.on('connection', onConnection)
 
    console.log(`App Web Socket Server is running!`)
    return wss
}
