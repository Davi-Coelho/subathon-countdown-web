module.exports = (application) => {
    application.get('/auth', (req, res) => {
        application.app.controllers.index.auth(application, req, res)
    })

    application.get('/callback', (req, res) => {
        application.app.controllers.index.callback(application, req, res)
    })
}