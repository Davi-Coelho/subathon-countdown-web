const mongoose = require('mongoose')

const {
    DB,
    DB_USER,
    DB_PASS
} = process.env

const userSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    accessToken: {
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

const userModel = mongoose.model('subathon_config', userSchema)

async function initDatabase() {
    try {
        await mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@mongo:27017/${DB}?authSource=admin`)
        console.log('Conectado ao banco de dados!')
    } catch (err) {
        console.log(`mongoConnectError: ${err}`)
    }
}

initDatabase()

module.exports = { userModel }
