
const timer = document.querySelector('#timer')

let countDownFunctionRef = null
let finalDate = 0

const ws = new WebSocket(`ws:localhost:3005/?channel=${channel}`)

ws.onopen = function () {
    ws.send('conectado!')
}

ws.onmessage = function (msg) {

    const data = JSON.parse(msg.data)
    console.log(data)

    if (data.type === 'start') {
        finalDate = parseFloat(data.finalDate)
        updateTimer()
        playTimer()
    } else if (data.type === 'pause') {
        clearInterval(countDownFunctionRef)
    } else if (data.type === 'update') {
        finalDate = parseFloat(data.finalDate)
        updateTimer()
    } else if (data.type === 'resume') {
        finalDate = parseFloat(data.finalDate)
        playTimer()
    } else if (data.type === 'stop') {
        finalDate = 0
        setTimer(0, 0, 0)
        clearInterval(countDownFunctionRef)
    }
}

function playTimer() {
    countDownFunctionRef = setInterval(function () {
        const now = new Date().getTime()
        const timeLeft = finalDate - now

        if (timeLeft >= 0) {
            updateTimer('secondUnit')
        } else {
            clearInterval(countDownFunctionRef)
        }
    }, 1000);
}

function setTimer(hours, minutes, seconds) {
    timer.innerHTML = `${make2Digit(hours)}:${make2Digit(minutes)}:${make2Digit(seconds)}`
}

function updateTimer() {
    const now = new Date().getTime()
    const timeLeft = finalDate - now
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    setTimer(hours, minutes, seconds)
}

function make2Digit(i) {
    if (i < 10) {
        i = "0" + i;
    }

    return i;
}

async function loadConfig() {

    const config = JSON.parse(await (await fetch(`/subathon/config/${channel}`)).text())

    if (Object.keys(config).length) {
        finalDate = parseFloat(config.finalDate)

        if (finalDate) {
            updateTimer()

            if (config.running) {
                playTimer()
            }
        } else {
            setTimer(0, 0, 0)
        }
    } else {
        setTimer(0, 0, 0)
    }
}

loadConfig()