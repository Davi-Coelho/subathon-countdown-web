class UserDAO {
    constructor(UserModel) {
        this._UserModel = UserModel
    }

    getConfig = async (id) => {
        return await this._UserModel.findOne({ id })
    }

    saveConfig = (id, channel, timer, code, accessToken, callback) => {
        this._UserModel.create({
            id: id,
            channel: channel,
            code: code,
            accessToken: accessToken,
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

    updateConfig = (id, finalDate, running, callback) => {
        this._UserModel.updateOne({
                id: id
        },
        {
            $set: {
                finalDate: finalDate,
                running: running
            }
        }).then(result => {
            console.log(result)
            console.log(`${id} atualizado!`)
            callback(result)
        }).catch(error => {
            console.log(error)
            console.log(`Erro ao atualizar o canal ${id}`)
        })
    }

}

module.exports = () => {
    return UserDAO
}
