module.exports.showTimer = async (application, req, res) => {
    const id = req.params.id

    const UserDAO = new application.app.models.UserDAO(application.db.UserModel)
    const channelConfig = await UserDAO.getConfig(id)

    res.render(channelConfig.timer, { id })
}

module.exports.updateTimer = (application, req, res) => {
    const id = req.params.id

    const newConfig = {
        type: req.body.type,
        finalDate: req.body.finalDate,
        running: req.body.running
    }

    const UserDAO = new application.app.models.UserDAO(application.db.UserModel)
    UserDAO.updateConfig(id, newConfig.finalDate, newConfig.running, (result) => {
        const ws = Array.from(application.appWs.clients).filter(el => el.id === id)
        ws.forEach(el => el.send(JSON.stringify(newConfig)))
        res.sendStatus(200)
    })
}
