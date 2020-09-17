const socket = io()

socket.on('message', (welcomeMsg) => {
    console.log(welcomeMsg)
})

document.querySelector('#messageForm').addEventListener('submit', (e) => {
    e.preventDefault()
    const messageToSend = e.target.elements.message.value
    socket.emit('sendMessage', messageToSend)
})


