module.exports = (application) => {
    application.get('/subathon/timer/:channel', (req, res) => {
        application.app.controllers.timer.showTimer(application, req, res)
    })

    application.post('/subathon/timer/:channel', (req, res) => {
        application.app.controllers.timer.updateTimer(application, req, res)
    })

    application.get('/subathon/config/:channel', (req, res) => {
        application.app.controllers.timer.getConfig(application, req, res)
    })

    application.post('/subathon/config/:channel', (req, res) => {
        application.app.controllers.timer.createConfig(application, req, res)
    })
}
