const mongoose = require('mongoose')

const {
    DB,
    DB_USER,
    DB_PASS
} = process.env

const configSchema = mongoose.Schema({
    channel: {
        type: String,
        required: true
    },
    finalDate: {
        type: String,
        required: true
    },
    running: {
        type: Boolean,
        required: true
    },
    timer: {
        type: String,
        required: true
    }
})

const ConfigModel = mongoose.model('subathon_config', configSchema)

async function initDatabase() {
    try {
        await mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@mongo-0.mongo,mongo-1.mongo/${DB}?authSource=admin`)
        console.log('Conectado ao banco de dados!')
    } catch (err) {
        console.log(`mongoConnectError: ${err}`)
    }
}

initDatabase()

module.exports = { ConfigModel }
