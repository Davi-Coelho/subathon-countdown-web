module.exports.showTimer = (application, req, res) => {
    const channel = req.params.channel
    
    res.render('timer', { channel })
}

module.exports.updateTimer = (application, req, res) => {
    const channel = req.params.channel

    const newConfig = {
        type: req.body.type,
        finalDate: req.body.finalDate,
        running: req.body.running
    }

    const ConfigDAO = new application.app.models.ConfigDAO(application.db.ConfigModel)
    ConfigDAO.updateConfig(channel, newConfig.finalDate, newConfig.running, (result) => {
        const ws = Array.from(application.appWs.clients).filter(el => el.id === channel)
        ws.forEach(el => el.send(JSON.stringify(newConfig)))
        res.sendStatus(200)
    })
}

module.exports.getConfig = async (application, req, res) => {
    const channel = req.params.channel
    const ConfigDAO = new application.app.models.ConfigDAO(application.db.ConfigModel)
    const channelConfig = (await ConfigDAO.getConfig(channel))

    if (channelConfig) {        
        res.send(channelConfig)
    } else {
        res.send({})
    }
}

module.exports.createConfig = (application, req, res) => {
    const channel = req.params.channel
    const finalDate = req.body.finalDate
    const ConfigDAO = new application.app.models.ConfigDAO(application.db.ConfigModel)
    ConfigDAO.saveConfig(channel,  finalDate, (result) => {

        res.sendStatus(200)
    })    
}