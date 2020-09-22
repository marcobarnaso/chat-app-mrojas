const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate the data

    if (!username || !room) {
        return {
            error: 'username and room are required'
        }
    }

    // check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // validate username

    if (existingUser) {
        return {
            error: 'username is in use'
        }
    }

    // store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {

    const user = users.find((user) => {
        return user.id === id
    })

    return user
}

const getRoomUsers = (room) => {
    const roomUsers = []
    users.find((user) => {
        const roomUser = user.room === room
        if (roomUser) {
            roomUsers.push(user)
        }
    })
    return roomUsers
}

module.exports = {
    addUser,
    removeUser,
    getRoomUsers,
    getUser
}