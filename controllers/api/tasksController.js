/**
 * @author Tom Käppler <tomkaeppler@web.de>
 * @version 1.0.0
 */

const { Op } = require("sequelize");
const Controller = require('../mainController.js')
const ApiError = require('../../core/error.js');
const Helper = require('./helper.js');

class ApiTasksController extends Controller {

    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        //user needs to be authorized, else he will get 401: unauthorized
        self.before(['*'], function (next) {
            if (self.req.authorized === true) {
                next();
            } else {
                self.render({}, {
                    statusCode: 401
                });
            }
        });
    }

    async actionIndex() {
        const self = this;

        let tasks = [];
        let error = null;

        try {
            tasks = await self.db.Task.findAll({
                where: {},
                attributes: ['id', 'name', 'text', 'alreadyWorkedTime', 'maximumWorkTime', 'deadline', 'createdAt', 'updatedAt'],
                include: self.db.Task.extendInclude
            });
            if (!tasks) {
                throw new ApiError('No tasks found', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                tasks: tasks
            });
        }
    }

    async actionShow() {
        const self = this;

        let taskId = self.param('id');
        let task = null;
        let error = null;

        try {
            task = await self.db.Task.findOne({
                where: {
                    id: taskId
                },
                attributes: ['id', 'name', 'text', 'alreadyWorkedTime', 'maximumWorkTime', 'deadline', 'createdAt', 'updatedAt'],
                include: self.db.Task.extendInclude
            });
            if (!task) {
                throw new ApiError('No task found with this id', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                task: task
            });
        }
    }

    async actionCreate() {
        const self = this;

        //check if the logged in person has the permission to create tasks
        if (Helper.checkPermission(Helper.canCreateTask, self.req.user.permission)) {
            let remoteData = self.param('task');

            let task = null;
            let error = null;

            try {
                task = await self.db.sequelize.transaction(async (t) => {
                    let newTask = self.db.Task.build();
                    newTask.writeRemotes(remoteData);

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

            if (error) {
                self.handleError(error);
            } else {
                self.render({
                    task: task
                }, {
                    statusCode: 201
                });
            }
        } else {
            self.render({}, {
                statusCode: 403
            });
        }
    }

    async actionUpdate() {
        const self = this;

        //check if the logged in person has the permission to update tasks
        if (Helper.checkPermission(Helper.canUpdateTask, self.req.user.permission)) {

            //task should be a object with all the values (new and old)
            let remoteData = self.param('task');
            let taskId = self.param('id');

            let task = null;
            let error = null;

            //get the old task
            try {
                let where = {};

                where = {
                    [Op.or]: [{
                        id: taskId,
                        assignedToId: self.req.user.id
                    }, {
                        id: taskId,
                        creatorId: self.req.user.id
                    },]
                };

                task = await self.db.sequelize.transaction(async (t) => {
                    let updatedTask = await self.db.Task.findOne({
                        where: where
                    }, { transaction: t })
                    if (updatedTask) {
                        await updatedTask.update({
                            name: remoteData['name'],
                            text: remoteData['text'],
                            assignedToId: remoteData['assignedToId'],
                            projectId: remoteData['projectId'],
                            updatedAt: new Date()
                        }, {
                            where: {
                                id: taskId
                            }
                        }, { transaction: t, lock: true });
                    }

                    return updatedTask;
                });
                if (!task) {
                    throw new ApiError('Task could not be updated', 404);
                }
            } catch (err) {
                error = err;
            }

            if (error) {
                self.handleError(error);
            } else {
                self.render({
                    task: task
                }, {
                    statusCode: 202
                });
            }
        } else {
            self.render({}, {
                statusCode: 403
            });
        }
    }

    async actionDelete() {
        const self = this;

        //check if the logged in person has the permission to delete tasks
        if (Helper.checkPermission(Helper.canDeleteTask, self.req.user.permission)) {
            let taskId = self.param('id');

            let task = null;
            let error = null;

            //get the old task
            try {
                task = await self.db.sequelize.transaction(async (t) => {
                    task = await self.db.Task.destroy({
                        where: {
                            id: taskId,
                            creatorId: self.req.user.id
                        }
                    }, { transaction: t, lock: true })

                    return task;
                });
                if (task === 0) {
                    throw new ApiError('Could not delete task', 404);
                }
            } catch (err) {
                error = err;
            }

            if (error) {
                self.handleError(error);
            } else {
                self.render({}, {
                    statusCode: 204
                });
            }
        } else {
            self.render({}, {
                statusCode: 403
            });
        }
    }
}

module.exports = ApiTasksController;