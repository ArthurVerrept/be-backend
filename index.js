var five = require('johnny-five')
const http = require('http')
const WebSocketServer = require('websocket').server
const { Led, Sensor } = require('johnny-five')

var board = new five.Board()

// once the board is ready
board.on('ready', function() {

    let connection
    // Create server on arduino
    const httpServer = http.createServer(() => {})

    // create a websocket server and pass it the http server we created to use
    const wsServer = new WebSocketServer({
        "httpServer": httpServer
    })

    wsServer.on('request', request => {
        connection = request.accept(null, request.origin)
        
        const sensorAmount = 9
        const PRESSURE_THRESHOLD = 0

        let stateArray = []
        let ledObj = {}
        let sensorArray = []
        for (let i = 0; i < sensorAmount; i++) {
            var sensor = new Sensor(i)
            sensorArray.push(sensor)

            var led = new Led(i+2)
            ledObj[i] = led
            stateArray.push('OFF') 
        }

        console.log((new Date()) + 'New Connection accepted')
        
        sensorArray.forEach((sensor) => {
            sensor.on("change", function() {
                if (this.value > PRESSURE_THRESHOLD && stateArray[this.pin] === 'OFF') {
                    let send = {
                        sensor: this.pin,
                        val: 'ON'
                    }
                    ledObj[this.pin].on()
                    stateArray[this.pin] = 'ON'
                    connection.sendUTF(JSON.stringify(send))
                }
    
                if (this.value <= PRESSURE_THRESHOLD && stateArray[this.pin] !== 'OFF') {
                    let send = {
                        sensor: this.pin,
                        val: 'OFF'
                    }
                    stateArray[this.pin] = 'OFF'
                    ledObj[this.pin].fadeOut(250)
                    connection.sendUTF(JSON.stringify(send))
                }
            })
        })
    })

    httpServer.listen(4000, () => console.log('server listening on port 4000'))
})

