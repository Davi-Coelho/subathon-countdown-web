module.exports.showTimer = (application, req, res) => {
    const channel = req.params.channel
    
    res.render('timer', { channel })
}
