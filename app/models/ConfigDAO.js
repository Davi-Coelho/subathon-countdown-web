class ConfigDAO {
    constructor(ConfigModel) {
        this._ConfigModel = ConfigModel
    }

    getConfig = async (channel) => {
        return await this._ConfigModel.findOne({ channel })
    }

    saveConfig = (channel, timer, callback) => {
        this._ConfigModel.create({
            channel: channel,
            finalDate: 0,
            running: false,
            timer: timer
        }).then(result => {
            console.log(result)
            console.log(`Configuração do canal ${channel} criada!`)
            callback(result)
        }).catch(error => {
            console.log(`Erro na criação da configuração do canal ${channel}!`)
        })
    }

    updateConfig = (channel, finalDate, running, callback) => {
        this._ConfigModel.updateOne({
            channel: channel
        },
        {
            $set: {
                finalDate: finalDate,
                running: running
            }
        }).then(result => {
            console.log(result)
            console.log(`${channel} atualizado!`)
            callback(result)
        }).catch(error => {
            console.log(error)
            console.log(`Erro ao atualizar o canal ${channel}`)
        })
    }

}

module.exports = () => {
    return ConfigDAO
}
