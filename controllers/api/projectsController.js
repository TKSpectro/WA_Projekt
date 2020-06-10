/**
 * @author Tom Käppler <tomkaeppler@web.de>
 * @version 1.0.0
 */

const Controller = require('../mainController.js')

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
                    transaction: t
                });

                return newProject;
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
                project: project
            });
        }
    }

    async actionUpdate() {
        const self = this;

        let remoteData = self.param('project');
        let newProject = null;
        let error = null;
        let projectid = self.param('id');

        /*{
            transaction: t
        }*/

        try {
            //project = await self.db.sequelize.transaction(async(t) => {
            newProject = await self.db.Project.findOne({
                where: {
                    id: projectid
                }
            }).then(newProject => {
                // console.log(oldProject);
                if (newProject) {
                    // oldProject.update(remoteData)

                    //oldProject.writeRemotes(remoteData);

                    newProject.update({
                        name: remoteData['name'],
                        updatedAt: new Date()
                    });
                }
            });
            return newProject;
            //});
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
                newProject: newProject
            });
        }
    }

}

module.exports = ApiProjectsController;