module.exports = (application) => {
    application.get('/timer/:channel', (req, res) => {
        application.app.controllers.timer.showTimer(application, req, res)
    })
}
