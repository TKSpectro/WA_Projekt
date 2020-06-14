/**
 * 
 */

const Passport = require('./passport.js');


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
                        let userSocket = self.findUserSocketById(message.toId);
                        if (userSocket) {
                            response.to = {
                                displayName: socket.user.fullname(),
                                id: socket.user.id
                            };
                            userSocket.emit('message', response);
                            socket.emit('message', response);
                        }
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
        })
    }
}

module.exports = SocketHandler;