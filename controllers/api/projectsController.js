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
    /**
     * @api {get} /projects Show projects
     * @apiName GetProjects
     * @apiGroup Project
     *
     * @apiSuccess {Object[]} projects                  Array of projects.
     * 
     * @apiSuccess {Object} projects.project                One project from the array.
     * 
     * @apiSuccess {Number} projects.project.id                 Users unique id.
     * @apiSuccess {String} projects.project.name               Name of the project.
     * @apiSuccess {String} projects.project.createdAt          Date of creation.
     * @apiSuccess {String} projects.project.updatedAt          Date of last update.
     * 
     * @apiSuccess {Object[]} projects.project.tasks                Tasks which are in the project
     * @apiSuccess {Object}   projects.project.tasks.task           Task in the tasks array
     * @apiSuccess {Number}   projects.project.tasks.task.id        Task id.
     * @apiSuccess {String}   projects.project.tasks.task.name      Task name.
     * @apiSuccess {String}   projects.project.tasks.task.text      Task text.
     * 
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 200 OK
     *  {
     *      "projects": [
     *          {
     *              "id": 1,
     *              "name": "First Project",
     *              "createdAt": "2020-06-18T13:07:03.000Z",
     *              "updatedAt": "2020-06-18T13:07:03.000Z",
     *              "tasks": [
     *                  {
     *                      "id": 4,
     *                      "name": "First Task",
     *                      "text": "This is the first Task"
     *                  },
     *                  {
     *                      "id": 5,
     *                      "name": "Second Task",
     *                      "text": "This is the second Task"
     *                  },
     *                  {
     *                      "id": 6,
     *                      "name": "Third Task",
     *                      "text": "This is the thirdTask"
     *                  }
     *              ]
     *          },
     *          {
     *              "id": 2,
     *              "name": "Second Project",
     *              "createdAt": "2020-06-18T13:07:03.000Z",
     *              "updatedAt": "2020-06-18T13:07:03.000Z",
     *              "tasks": []
     *          }
     *      ]
     *  }
     */
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

    /**
     * @api {get} /project/:id Show project with id
     * @apiName GetProject
     * @apiGroup Project
     *
     * @apiSuccess {Object} project                One project.
     * 
     * @apiSuccess {Number} project.id                 Users unique id.
     * @apiSuccess {String} project.name               Name of the project.
     * @apiSuccess {String} project.createdAt          Date of creation.
     * @apiSuccess {String} project.updatedAt          Date of last update.
     * 
     * @apiSuccess {Object[]} project.tasks                Tasks which are in the project
     * @apiSuccess {Object}   project.tasks.task           Task in the tasks array
     * @apiSuccess {Number}   project.tasks.task.id        Task id.
     * @apiSuccess {String}   project.tasks.task.name      Task name.
     * @apiSuccess {String}   project.tasks.task.text      Task text.
     * 
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 200 OK
     *  {
     *      "project": {
     *          "id": 1,
     *          "name": "First Project",
     *          "createdAt": "2020-06-18T13:07:03.000Z",
     *          "updatedAt": "2020-06-18T13:07:03.000Z",
     *          "tasks": [
     *              {
     *                  "id": 4,
     *                  "name": "First Task",
     *                  "text": "This is the first Task"
     *              },
     *              {
     *                  "id": 5,
     *                  "name": "Second Task",
     *                  "text": "This is the second Task"
     *              },
     *              {
     *                  "id": 6,
     *                  "name": "Third Task",
     *                  "text": "This is the thirdTask"
     *              }
     *          ]
     *      }
     *  }
     */
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

    /**
     * @api {post} /projects Create project
     * @apiName CreateProject
     * @apiGroup Project
     * 
     * @apiExample Usage:
     *  endpoint: http://localhost/api/projects
     * 
     *  json-body:
     *  {
     *      "project": {
     *          "name": "ApiDoc Project"
     *      }
     *  }
     * 
     * @apiSuccess {Object} project                One user from the array.
     * 
     * @apiSuccess {Number} project.id                 Projects unique id.
     * @apiSuccess {String} project.name               Name of the project.
     * @apiSuccess {String} project.createdAt          Date of creation.
     * @apiSuccess {String} project.updatedAt          Date of last update.
     * 
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 200 OK
     *  {
     *      "project": {
     *          "id": 3,
     *          "name": "ApiDoc Project",
     *          "updatedAt": "2020-06-18T14:23:12.229Z",
     *          "createdAt": "2020-06-18T14:23:12.229Z"
     *      }
     *  }
     */
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

    /**
     * @api {post} /projects Update project
     * @apiName UpdateProject
     * @apiGroup Project
     * 
     * @apiExample Usage:
     *  endpoint: http://localhost/api/projects/:id/update
     * 
     *  json-body:
     *  {
     *      "project": {
     *          "name": "ApiDoc Project"
     *      }
     *  }
     * 
     * @apiSuccess {Object} project                One user from the array.
     * 
     * @apiSuccess {Number} project.id                 Projects unique id.
     * @apiSuccess {String} project.name               Name of the project.
     * @apiSuccess {String} project.createdAt          Date of creation.
     * @apiSuccess {String} project.updatedAt          Date of last update.
     * 
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 200 OK
     *  {
     *      "project": {
     *          "id": 3,
     *          "name": "ApiDoc Project",
     *          "updatedAt": "2020-06-18T14:23:12.229Z",
     *          "createdAt": "2020-06-18T14:23:12.229Z"
     *      }
     *  }
     */
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
                    }, { transaction: t });
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

    /**
     * @api {get} /projects/:id/delete Delete project
     * @apiName DeleteProject
     * @apiGroup Project
     * 
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 200 OK
     *  {
     *      "project": "deleted"
     *  }
     */
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
                }), { transaction: t }
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