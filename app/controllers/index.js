require('dotenv').config()
const axios = require('axios')
const qs = require('qs')
const crypto = require('crypto')

module.exports.auth = async (application, req, res) => {
    const UserDAO = new application.app.models.UserDAO(application.db.UserModel)
    const code = req.query.code
    const state = req.query.state

    const {
        STREAMLABS_APP_CLIENT_ID,
        STREAMLABS_APP_CLIENT_SECRET,
        STREAMLABS_REDIRECT_URI
    } = process.env

    const dataToken = qs.stringify({
        'grant_type':    'authorization_code',
        'client_id':     STREAMLABS_APP_CLIENT_ID,
        'client_secret': STREAMLABS_APP_CLIENT_SECRET,
        'redirect_uri':  STREAMLABS_REDIRECT_URI,
        'code':          code
    })

    const configToken = {
        method: 'post',
        url: 'https://streamlabs.com/api/v2.0/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        },
        data: dataToken
    }

    try {
        const responseToken = await axios.request(configToken)
        console.log(responseToken.data)
    } catch(error) {
        console.log(error)
        res.sendStatus(500)
    }

    const accessToken = responseToken.data.accessToken

    const configUser = {
        method: 'get',
        url: 'https://streamlabs.com/api/v2.0/user',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    }

    try {
        const responseUser = await axios.request(configUser)
        console.log(responseUser.data)
    } catch(error) {
        console.log(error)
        res.sendStatus(500)
    }


    const configSocket = {
        method: 'get',
        url: 'https://streamlabs.com/api/v2.0/socket/token',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': `Bearer ${accessToken}`
        }
    }

    try {
        const responseSocket = await axios.request(configSocket)
        console.log(responseSocket)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }

    const usersData = responseUser.data
    const streamlabsUserData = usersData.streamlabs
    const twitchUserData = usersData.twitch
    const id = crypto.createHash('md5').update(twitchUserData.name).digest('hex').toUpperCase()

    const streamlabsData = {
        user: streamlabsUserData,
        twitchUser: twitchUserData,
        accessToken: responseToken.accessToken,
        refreshToken: responseToken.refreshToken,
        socketToken: responseSocket.socketToken
    }

    const streamlabsUser = {
        id: id,
        finalDate: 0,
        running: false,
        timer: 'default_timer',
        streamlabsData: streamlabsData
    }

    UserDAO.saveConfig(streamlabsUser, (result, error) => {
        if (error !== null) {
            const authenticated = { id: streamlabsUser.id }
            const ws = Array.from(application.appWs.clients).filter(el => el.id === state)
            ws.forEach(el => el.send(JSON.stringify(authenticated)))
            res.render('auth')
        }
        console.log(error)
        res.sendStatus(500)
    })
}

module.exports.callback = async (application, req, res) => {
    res.sendStatus(200)
}