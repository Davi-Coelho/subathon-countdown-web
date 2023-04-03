require('dotenv').config()
const mongoose = require('mongoose')

const {
    DB,
    DB_USER,
    DB_PASS,
    ENV
} = process.env

const streamlabsUserDataSchema = mongoose.Schema({
    id:             { type: Number, required: true },
    display_name:   { type: String, required: true },
    username:       { type: String, required: true },
    thumbnail:      { type: String, required: true },
    primary:        { type: String, required: true }
}, { _id: false })

const streamlabsTwitchUserDataSchema = mongoose.Schema({
    id:             { type: Number, required: true },
    display_name:   { type: String, required: true },
    name:           { type: String, required: true },
    icon_url:       { type: String, required: true }
}, { _id: false })

const streamlabsSchema = mongoose.Schema({
    user:           streamlabsUserDataSchema,
    twitchUser:     streamlabsTwitchUserDataSchema,
    accessToken:    { type: String, required: true },
    refreshToken:   { type: String, required: true },
    socketToken:    { type: String },
}, { _id: false })

const streamlabsUserSchema = mongoose.Schema({
    id:             { type: String,  required: true },
    finalDate:      { type: String,  required: true },
    running:        { type: Boolean, required: true },
    timer:          { type: String,  required: true },
    streamlabsData: streamlabsSchema
}, { _id: false })

const streamlabsUserModel = mongoose.model('users', streamlabsUserSchema)

async function initDatabase() {
    try {
        if(ENV === 'prod') {
            await mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@mongo:27017/${DB}?authSource=admin`)
        } else {
            await mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@localhost:27017/${DB}?authSource=admin`)
        }
        console.log('Conectado ao banco de dados!')
    } catch (err) {
        console.log(`mongoConnectError: ${err}`)
    }
}

initDatabase()

module.exports = { streamlabsUserModel }
