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

            socket.on('message', async(data) => {
                //write incoming message to database
                let message = self.db.Message.build();
                message.writeRemotes(data);
                try {
                    message.fromId = socket.user.id;
                    await message.save();

                    let response = {
                        text: data.text,
                        from: {
                            displayName: socket.user.shortName(),
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




            socket.on('tasks/create', async(data) => {

                let task = null;
                let error = null;

                try {
                    console.log("dataName", data.task);
                    task = await self.db.sequelize.transaction(async(t) => {
                        let newTask = self.db.Task.build();
                        newTask.writeRemotes(data.task);

                        await newTask.save();

                        return newTask;
                        console.log(newTask);

                    });
                    if (!task) {
                        throw new ApiError('Task could not be created', 404);
                    }
                } catch (err) {
                    error = err;
                }

            });




            socket.on('task/move', async(data) => {
                //get message from database which was moved

                try {
                    let task = await self.db.sequelize.transaction(async(t) => {
                        let newTask = self.db.Task.build();
                        newTask.writeRemotes(data);

                        await newTask.save({
                            transaction: t,
                            lock: true
                        });

                        return newTask;
                    });
                    if (!task) {
                        throw new ApiError('Task could not be created', 404);
                    }
                } catch (err) {
                    error = err;
                }



                let task = await self.db.Task.findOne({
                    where: {
                        id: data.id,
                    }
                });

                //if we found that task in the database
                if (task) {
                    //task was moved to another workflow
                    if (task.workflowId !== data.workflowId) {
                        //update old workflow by lowering every task.sort by 1 if it was greater then the moved task.sort
                        await self.db.Task.update({
                            sort: self.db.sequelize.literal('sort - 1')
                        }, {
                            where: {
                                sort: {
                                    //operator.greaterThen
                                    [Op.gt]: task.sort,
                                },
                                workflowId: task.workflowId
                            }
                        });

                        //update new workflow by increasing every task.sort by 1 if it was greater then equal to the moved task.sort
                        await self.db.Task.update({
                            sort: self.db.sequelize.literal('sort + 1')
                        }, {
                            where: {
                                sort: {
                                    //operator.greaterThenEqual
                                    [Op.gte]: data.sort,
                                },
                                workflowId: data.workflowId
                            }
                        });
                        //task stayed in the same workflow
                    } else if (task.sort != data.sort) {
                        let operator = '+';
                        let sortWhere = {};
                        //new sorting bigger then old sorting -> we have to lower
                        if (data.sort > task.sort) {
                            operator = '-';
                            sortWhere = {
                                [Op.gt]: task.sort,
                                //operator.lowerThenEqual
                                [Op.lte]: data.sort
                            };
                            //new sorting smaller then old sorting -> we have to higher
                        } else {
                            sortWhere = {
                                [Op.gte]: data.sort,
                                //operator.lowerThen
                                [Op.lt]: task.sort
                            };
                        }

                        //update all tasks from the same workflow
                        await self.db.Task.update({
                            sort: self.db.sequelize.literal('sort ' + operator + ' 1')
                        }, {
                            where: {
                                sort: sortWhere,
                                workflowId: task.workflowId,
                                //we do not have to check for projectId as every workflow(ids) are project specific
                                //one workflow cant be in two projects
                            }
                        });
                    }

                    //save the new data to our task
                    task.workflowId = data.workflowId;
                    task.sort = data.sort;
                    await task.save();
                }

                socket.broadcast.emit('task/move', data);
            });
        });
    }
}

module.exports = SocketHandler;