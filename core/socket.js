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

            socket.on('message', (data) => {
                var userId = null;
                let email = data.to;

                // find the User and save the Message in the DB
                let start = async function() {
                    let user = await self.db.User.findOne({
                        where: {
                            email: email
                        }
                    });
                    if (user.id) {
                        self.db.Message.create({
                            text: data.message,
                            fromId: socket.user.id,
                            toId: user.id
                        });
                    } else {
                        self.db.Message.create({
                            text: data.message,
                            fromId: socket.user.id,
                            toId: null
                        });
                    }

                    self.io.emit('message', {
                        message: data.message,
                        from: {
                            displayName: socket.user.fullname(),
                            id: socket.user.id
                        },
                        to: user.id,
                        time: new Date()
                    });

                }
                start();

            });
        });
    }
}

module.exports = SocketHandler;