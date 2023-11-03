const mongoose = require('mongoose')

const {
    DB,
    DB_USER,
    DB_PASS,
    ENV
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
        const url = ENV !== 'dev' ? `mongodb://${DB_USER}:${DB_PASS}@mongo-0.mongo/${DB}?authSource=admin` : 'mongodb://mongo:27017/subathontimer'
        await mongoose.connect(url)
        console.log('Conectado ao banco de dados!')
    } catch (err) {
        console.log(`mongoConnectError: ${err}`)
    }
}

initDatabase()

module.exports = { ConfigModel }
