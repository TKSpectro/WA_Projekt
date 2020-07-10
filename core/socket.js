/**
 * 
 */

const Passport = require('./passport.js');
const { Op, TableHints } = require("sequelize");

class SocketHandler {
    constructor(io, db) {
        const self = this;

        self.db = db;
        self.io = io;
        self.sockets = {};

        io.use((socket, next) => {
            let handshakeData = socket.handshake;
            let tokenPayload = Passport.isAuthorized(handshakeData);

            if (tokenPayload === false) {
                next(new Error('unauthorized'));
            } else {
                self.db.User.findOne({
                    where: {
                        id: tokenPayload.id
                    }
                }).then((user) => {
                    if (!user) {
                        next(new Error('unauthorized'));
                    } else {
                        socket.user = user;
                        next();
                    }
                }).catch((err) => {
                    console.error(err);
                    next(new Error('unauthorized'));
                });
                //TODO: check if Payload is still valid (not expired)
            }
        });

        self.initEvents();
    }

    // um zu überprüfen ob der Nutzer online ist
    findUserSocketById(id) {
        let socket = null;
        for (let key in this.sockets) {
            socket = this.sockets[key];
            if (socket.user && socket.user.id === id) {
                return socket;
            }
        }

        return null;
    }

    initEvents() {
        const self = this;

        self.io.on('connection', (socket) => {
            console.log('new client connected', socket.id);
            self.sockets[socket.id] = socket;

            socket.on('disconnect', () => {
                console.log('disconnected client', socket.id);
                if (self.sockets[socket.id]) {
                    delete self.sockets[socket.id];
                }
            });

            socket.on('message', async (data) => {
                //write incoming message to database
                let message = self.db.Message.build();
                message.writeRemotes(data);
                try {
                    message.fromId = socket.user.id;
                    await message.save();

                    let response = {
                        text: data.text,
                        from: {
                            displayName: socket.user.fullname(),
                            id: socket.user.id
                        },
                        time: message.createdAt
                    };

                    if (message.toId) {
                        response.to = {
                            id: message.toId
                        }

                        let userSocket = self.findUserSocketById(message.toId);
                        if (userSocket) {
                            response.to.displayName = userSocket.user.fullname();
                            userSocket.emit('message', response);
                        };

                        socket.emit('message', response);
                    } else {
                        self.io.emit('message', response);
                    }
                } catch (err) {
                    console.log(err);
                    socket.emit('error', {
                        details: 'Could not save message, something went wrong',
                        message: data
                    });
                }
            });

            socket.on('task/move', async (data) => {
                let movedTask = await self.db.Task.findOne({
                    where: {
                        id: data.id,
                    }
                });
                // Save oldSort for convenient usage
                const oldSort = movedTask.sort;

                // Determine if the user is moving the item up or down in the listing
                // True = task was moved down
                // False = task was moved up
                const movedDown = oldSort < data.sort;

                /*
                if (movedTask) {
                    movedTask.workflowId = data.workflowId;
                    movedTask.sort = data.sort;
                    await movedTask.save();
                }
                */

                /*

                Drag-and-drop moves (e.g., move item 6 to sit between items 9 and 10) are a little trickier and have to be done differently
                depending on whether the new position is above or below the old one.
                In the example above, you have to open up a hole by incrementing all positions greater than 9,
                updating item 6's position to be the new 10 and then decrementing the position of everything greater than 6 to fill in the vacated spot.
                
                */

                //if task was moved in the same workflow
                if (parseInt(movedTask.workflowId) === parseInt(data.workflowId)) {
                    let tasks = await self.db.Task.findAll({
                        where: {
                            workflowId: data.workflowId
                        },
                        order: [
                            ['sort', 'ASC']
                        ]
                    });

                    if (movedDown) {
                        console.log('\nmovedDown\n')
                        // Increment every sort of positions greater then the new one
                        for (let i = data.sort; i < tasks.length; i++) {
                            const task = tasks[i];
                            task.sort++;
                            task.save();
                            tasks[i].sort = task.sort;
                        }

                        // Set the sort for the moved task
                        movedTask.sort = data.sort;
                        movedTask.save();
                        tasks[data.sort].sort = movedTask.sort;

                        // Decrement every sort of positions greater then the old one
                        for (let i = oldSort + 1; i < tasks.length; i++) {
                            const task = tasks[i];
                            task.sort--;
                            task.save();
                            tasks[i].sort = task.sort;
                        }
                    } else {
                        console.log('\nmovedDown\n')
                        // Increment every sort of positions greater then the new one
                        for (let i = data.sort; i < tasks.length; i++) {
                            const task = tasks[i];
                            task.sort++;
                            task.save();
                            tasks[i].sort = task.sort;
                        }

                        // Set the sort for the moved task
                        movedTask.sort = data.sort;
                        movedTask.save();
                        tasks[data.sort].sort = movedTask.sort;

                        // Decrement every sort of positions greater then the old one
                        for (let i = oldSort + 1; i < tasks.length; i++) {
                            const task = tasks[i];
                            task.sort--;
                            task.save();
                            tasks[i].sort = task.sort;
                        }
                    }
                } else { //moved task to other workflow
                    let movedTask = await self.db.Task.findOne({
                        where: {
                            id: data.id,
                        }
                    });

                    if (movedTask) {
                        movedTask.workflowId = data.workflowId;
                        movedTask.sort = data.sort;
                        await movedTask.save();
                    }
                }
                socket.broadcast.emit('task/move', data);
            });
        })
    }
}

module.exports = SocketHandler;