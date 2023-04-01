require('dotenv').config()
const axios = require('axios')

module.exports.auth = async (application, req, res) => {
    const code = req.params.code

    const UserDAO = new application.app.models.UserDAO(application.db.UserModel)

    const params = {
        "grant_type": "authorization_code",
        "client_id": process.env.APP_CLIENT_ID,
        "client_secret": process.env.APP_CLIENT_SECRET,
        "redirect_uri": process.env.REDIRECT_URI,
        "code": code
    }

    axios.post('https://streamlabs.com/api/v2.0/token', params, {
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    }).then(response => {
        console.log(response)
        res.send("<script>window.close();</script>")
    }).catch(err => {
        console.log(err)
        res.sendStatus(500)
    })
}

module.exports.callback = async (application, req, res) => {
    console.log(req)
    console.log(req.params)
    console.log(req.body)
    res.sendStatus(200)
}