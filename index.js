var five = require('johnny-five')
const http = require('http')
const WebSocketServer = require('websocket').server

var board = new five.Board()

// once the board is ready
board.on('ready', function() {

    let connection
    // Create server on arduino
    const httpServer = http.createServer((req, res) => {
        console.log('we have received a request')
    })

    // create a websocket server and pass it the http server we created to use
    const wsServer = new WebSocketServer({
        "httpServer": httpServer
    })

    wsServer.on('request', request => {
        connection = request.accept(null, request.origin)
        
        const sensorAmount = 2

        let sensorArray = []
        for (let i = 0; i < sensorAmount; i++) {
            var sensor = new five.Sensor(i)
            sensorArray.push(sensor)
        }

        let valueArray = []
        for (let i = 0; i < sensorArray.length; i++) {
            valueArray.push('OFF') 
        }

        console.log((new Date()) + 'New Connection accepted')
        
        sensorArray.forEach((sensor) => {
            sensor.on("change", function() {
                // console.log(this.pin, this.value)
                if (this.value > 200 && valueArray[this.pin] === 'OFF') {
                    let send = {
                        sensor: this.pin,
                        val: 'ON'
                    }
                    valueArray[this.pin] = 'ON'
                    connection.sendUTF(JSON.stringify(send));
                    console.log(this.pin, valueArray[this.pin])
                }
    
                if (this.value === 0 && valueArray[this.pin] !== 'OFF') {
                    let send = {
                        sensor: this.pin,
                        val: 'OFF'
                    }
                    valueArray[this.pin] = 'OFF'
                    connection.sendUTF(JSON.stringify(send));
                    console.log(this.pin, valueArray[this.pin])
                }
            })
        })
    })

    httpServer.listen(4000, () => console.log('server listening on port 4000'))
});

