let wss = null
const { Server } = require('socket.io')
const { createAdapter } = require('@socket.io/redis-adapter')
const { createClient } = require('redis')

const { REDIS_PASS } = process.env
 
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

    const pubClient = createClient({ host: "redis", port: 6379, password: REDIS_PASS })
    const subClient = pubClient.duplicate()

    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
        wss.adapter(createAdapter(pubClient, subClient))
        wss.listen(3000)
    })
 
    wss.on('connection', onConnection)
 
    console.log(`App Web Socket Server is running!`)
    return wss
}
