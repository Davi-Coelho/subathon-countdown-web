const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/subathon_countdown')
    .then(() => console.log('Database connected!'))
    .catch(() => console.log('Database connection error!'))

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
    }
})

const ConfigModel = mongoose.model('subathon_config', configSchema)

module.exports = { ConfigModel }
