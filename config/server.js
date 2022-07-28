const express = require('express')
const consign = require('consign')
const db = require('./dbConnection')
const app = express()

app.set('view engine', 'ejs')
app.set('views', './app/views')

app.use('/static_subathon', express.static('./app/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

consign()
    .include('app/controllers')
    .then('app/models')
    .then('app/routes')
    .into(app)

app.db = db

module.exports = app
