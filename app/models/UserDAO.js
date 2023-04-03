class UserDAO {
    constructor(UserModel) {
        this._UserModel = UserModel
    }

    getConfig = async (id) => {
        return await this._UserModel.findOne({ id })
    }

    saveConfig = (streamlabsUser, callback) => {
        this._UserModel.create(streamlabsUser).then(result => {
            console.log(result)
            console.log(`Configuração do canal ${streamlabsUser.streamlabsData.twitchUser.name} criada!`)
            callback(result, null)
        }).catch(error => {
            console.log(`Erro na criação da configuração do canal ${streamlabsUser.streamlabsData.twitchUser.name}!`)
            callback(null, error)
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
