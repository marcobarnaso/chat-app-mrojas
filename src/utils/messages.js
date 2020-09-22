const generateMessage = (username, text) => {
    const time = new Date()

    return {
        username,
        text,
        createdAt: time 
    }
}

const generateLocationMessage = (username, text) => {
    const date = new Date()

    return {
        username,
        text,
        date,
    }
} 


module.exports = {
    generateMessage,
    generateLocationMessage
}