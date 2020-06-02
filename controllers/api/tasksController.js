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
        } catch (err) {
            error = err;
        }

        if (error) {
            self.render({
                details: error
            }, {
                statusCode: 500
            });
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
        } catch (err) {
            error = err;
        }

        if (error !== null) {
            console.error(error);
            self.render({
                details: error
            }, {
                statusCode: 500
            });
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
        } catch (err) {
            error = err;
        }

        if (error !== null) {
            console.error(error);
            self.render({
                details: error
            }, {
                statusCode: 500
            });
        } else {
            self.render({
                task: task
            });
        }
    }
}

module.exports = ApiTasksController;