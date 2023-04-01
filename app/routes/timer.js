module.exports = (application) => {
    application.get('/timer/:id', (req, res) => {
        application.app.controllers.timer.showTimer(application, req, res)
    })

    application.post('/timer/:id', (req, res) => {
        application.app.controllers.timer.updateTimer(application, req, res)
    })
}
