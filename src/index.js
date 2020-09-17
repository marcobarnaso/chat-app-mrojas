const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))



io.on('connection', (socket) => {
    console.log('New websocket connection')
    
    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has connected!')

    socket.on('sendMessage', (messageSent) => {
        io.emit('message', messageSent)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })

})

server.listen(port, () => {
    console.log(`Local server is up and running on port ${port}!`)
}) 




