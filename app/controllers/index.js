require('dotenv').config()
const axios = require('axios')
const qs = require('qs')
const crypto = require('crypto')

module.exports.auth = async (application, req, res) => {
    const UserDAO = new application.app.models.UserDAO(application.db.UserModel)
    const code = req.query.code
    const state = req.query.state
    const ws = Array.from(application.appWs.clients).filter(el => el.id === state)

    const {
        STREAMLABS_APP_CLIENT_ID,
        STREAMLABS_APP_CLIENT_SECRET,
        STREAMLABS_REDIRECT_URI
    } = process.env

    let responseToken = null

    try {
        responseToken = await axios.request({
            method: 'post',
            url: 'https://streamlabs.com/api/v2.0/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            data: qs.stringify({
                'grant_type':    'authorization_code',
                'client_id':     STREAMLABS_APP_CLIENT_ID,
                'client_secret': STREAMLABS_APP_CLIENT_SECRET,
                'redirect_uri':  STREAMLABS_REDIRECT_URI,
                'code':          code
            })
        })
        console.log(responseToken.data)
    } catch(error) {
        console.log(error)
        ws.forEach(el => el.send(JSON.stringify({ authenticated: false })))
        res.render('auth', { success: false })
        return
    }

    const accessToken = responseToken.data.accessToken
    let responseUser = null

    try {
        responseUser = await axios.request({
            method: 'get',
            url: 'https://streamlabs.com/api/v2.0/user',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        console.log(responseUser.data)
    } catch(error) {
        console.log(error)
        ws.forEach(el => el.send(JSON.stringify({ authenticated: false })))
        res.render('auth', { success: false })
        return
    }

    let responseSocket = null

    try {
        responseSocket = await axios.request({
            method: 'get',
            url: 'https://streamlabs.com/api/v2.0/socket/token',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        console.log(responseSocket)
    } catch (error) {
        console.log(error)
        ws.forEach(el => el.send(JSON.stringify({ authenticated: false })))
        res.render('auth', { success: false })
        return
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
        let responseWs = null
        if (error !== null) {
            console.log(error)
            responseWs = { authenticated: false }
        } else {
            console.log(result)
            responseWs = {
                authenticated: true,
                id: streamlabsUser.id,
                display_name: streamlabsUser.streamlabsData.twitchUser.display_name,
                profile_url: streamlabsUser.streamlabsData.twitchUser.icon_url
            }
        }
        ws.forEach(el => el.send(JSON.stringify(responseWs)))
        res.render('auth', { success: result !== null })
    })
}

module.exports.callback = async (application, req, res) => {
    res.sendStatus(200)
}