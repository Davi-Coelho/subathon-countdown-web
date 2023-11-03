let wss = null
const { Server } = require('socket.io')
const { createAdapter } = require('@socket.io/redis-adapter')
const { createClient } = require('redis')

const { ENV } = process.env
 
function onMessage(ws, data) {
    const time = new Date()
    console.log(`${ws.channel} ${data} - ${time}`)
}
 
function onConnection(ws) {
    const channel = ws.handshake.query['channel']
    ws.channel = channel
    ws.join(channel)
    ws.on('message', data => onMessage(ws, data))
}
 
module.exports = (server) => {
    wss = new Server(server, { transports: ['websocket'] })

    const url = ENV !== 'dev' ? "redis://redis-0.redis.redis.svc.cluster.local" : 'redis://redis-stack:6379'
    const pubClient = createClient({ url })
    const subClient = pubClient.duplicate()

    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
        wss.adapter(createAdapter(pubClient, subClient))
        wss.listen(3000)
    })
 
    wss.on('connection', onConnection)
 
    console.log(`App Web Socket Server is running!`)
    return wss
}
