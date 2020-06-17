/**
 * @author Tom Käppler <tomkaeppler@web.de>
 * @version 1.0.0
 */

const Controller = require('../mainController.js')

class ApiTasksController extends Controller {

    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

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
                attributes: ['id', 'name', 'createdAt', 'updatedAt'],
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
                attributes: ['id', 'name', 'createdAt', 'updatedAt'],
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

        let remoteData = self.param('task');

        let task = null;
        let error = null;

        try {
            task = await self.db.sequelize.transaction(async (t) => {
                let newTask = self.db.Task.build();
                newTask.writeRemotes(remoteData);

                await newTask.save({
                    transaction: t
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
            });
        }
    }

    async actionUpdate() {
        const self = this;

        //task should be a object with all the values (new and old)
        let remoteData = self.param('task');
        let taskId = self.param('id');

        let task = null;
        let error = null;

        //get the old task
        try {
            task = await self.db.sequelize.transaction(async (t) => {
                let updatedTask = await self.db.Task.findOne({
                    where: {
                        id: taskId
                    }
                }, { transaction: t })
                if (updatedTask) {
                    await updatedTask.update({
                        name: remoteData['name'],
                        text: remoteData['text'],
                        creatorId: remoteData['creatorId'],
                        assignedToId: remoteData['assignedToId'],
                        projectId: remoteData['projectId'],
                        updatedAt: new Date()
                    }, {
                        where: {
                            id: taskId
                        }
                    }, { transaction: t });
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
            });
        }
    }

    async actionDelete() {
        const self = this;

        let taskId = self.param('id');

        let task = null;
        let error = null;

        //get the old task
        try {
            task = await self.db.sequelize.transaction(async (t) => {
                task = await self.db.Task.destroy({
                    where: {
                        id: taskId
                    }
                }), { transaction: t }
            });
            if (!task) {
                throw new ApiError('Could not delete task', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                task: 'deleted'
            });
        }
    }
}

module.exports = ApiTasksController;