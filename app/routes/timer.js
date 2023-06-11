module.exports = (application) => {
    application.get('/timer/:channel', (req, res) => {
        application.app.controllers.timer.showTimer(application, req, res)
    })

    application.post('/timer/:channel', (req, res) => {
        application.app.controllers.timer.updateTimer(application, req, res)
    })

    application.get('/config/:channel', (req, res) => {
        application.app.controllers.timer.getConfig(application, req, res)
    })

    application.post('/config/:channel', (req, res) => {
        application.app.controllers.timer.createConfig(application, req, res)
    })
}
