/**
 * @author Tom Käppler <tomkaeppler@web.de>
 * @version 1.0.0
 */

const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');

class ApiProjectsController extends Controller {

    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        self.before(['*'], function(next) {
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

        let projects = [];
        let error = null;

        try {
            projects = await self.db.Project.findAll({
                where: {},
                attributes: ['id', 'name', 'createdAt', 'updatedAt'],
                include: self.db.Project.extendInclude
            });

            if (!projects) {
                throw new ApiError('No projects found', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                projects: projects
            });
        }
    }

    async actionShow() {

        const self = this;

        let projectId = self.param('id');
        let project = null;
        let error = null;


        try {
            project = await self.db.Project.findOne({
                where: {
                    id: projectId
                },
                attributes: ['id', 'name', 'createdAt', 'updatedAt'],
                include: self.db.Project.extendInclude
            });

            if (!project) {
                throw new ApiError('No project found with this id', 404);
            }
            console.log(project.id);
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                project: project
            });
        }
    }

    async actionCreate() {
        const self = this;

        let remoteData = self.param('project');


        let project = null;
        let error = null;

        try {
            project = await self.db.sequelize.transaction(async(t) => {
                let newProject = self.db.Project.build();
                newProject.writeRemotes(remoteData);

                await newProject.save({
                    transaction: t, lock: true
                });

                return newProject;
            });

            if (!project) {
                throw new ApiError('Could not create the project', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                project: project
            });
        }
    }

    async actionUpdate() {
        const self = this;

        //newProject should be a object with all the values (new and old)
        let remoteData = self.param('project');
        let projectId = self.param('id');

        let project = null;
        let error = null;

        //get the old Project
        try {
            project = await self.db.sequelize.transaction(async(t) => {
                let updatedProject = await self.db.Project.findOne({
                    where: {
                        id: projectId
                    }
                }, { transaction: t })
                if (updatedProject) {
                    await updatedProject.update({
                        name: remoteData['name'],
                        updatedAt: new Date()
                    }, {
                        where: {
                            id: projectId
                        }
                    }, { transaction: t, lock: true });
                }

                return updatedProject;
            });
            if (!project) {
                throw new ApiError('Project could not be updated', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                project: project
            });
        }
    }

    async actionDelete() {
        const self = this;

        let projectId = self.param('id');

        let project = null;
        let error = null;

        try {
            project = await self.db.sequelize.transaction(async(t) => {
                project = await self.db.Project.destroy({
                    where: {
                        id: projectId
                    }
                }), { transaction: t, lock: true }
            });
            if (project !== null) {
                throw new ApiError('Project could not be deleted', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                project: 'deleted'
            });
        }
    }
}

module.exports = ApiProjectsController;