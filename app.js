const app = require('./config/server')
const appWs = require('./config/ws')
const port = 80

const server = app.listen(port, () => console.log(`App Express is running on port ${port}`))
app.appWs = appWs(server)
