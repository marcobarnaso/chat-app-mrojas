const express = require('express')
const path = require('path')
const http = require('http')
const { generateMessage, generateLocationMessage } = require('../src/utils/messages')
const {addUser, removeUser, getUser, getRoomUsers} = require('../src/utils/users')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const Filter = require('bad-words')
const { emit } = require('process')

const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New websocket connection')

    socket.on('signUp', ({ username, room }, ack) => {
        const {error, user} = addUser({ id: socket.id, username, room })

        if(error) {
           return ack(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('admin', `${user.username} has connected!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
        ack()
    })

    socket.on('sendMessage', (messageSent, ack) => {
        const user = getUser(socket.id)

        const filter = new Filter()

        if (filter.isProfane(messageSent)) {
            return ack(generateMessage('Profanity is not allowed!'))
        }

        ack()
        io.to(user.room).emit('message', generateMessage(user.username, messageSent))
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('message', generateMessage('admin', `${user.username} has disconnected from ${user.room}!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }  
    })

    socket.on('sendLocation', (position, ack) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${position.latitude},${position.longitude}`))
        ack()
    })
})

server.listen(port, () => {
    console.log(`Local server is up and running on port ${port}!`)
}) 
