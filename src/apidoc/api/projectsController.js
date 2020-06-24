/**
 * @api {get} /projects Show projects
 * @apiName getProjects
 * @apiGroup Projects
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

/**
 * @api {get} /projects/:id Show project with id
 * @apiName getProject
 * @apiGroup Projects
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

/**
 * @api {post} /projects Create project
 * @apiName createProject
 * @apiGroup Projects
 *
 * @apiPermission canCreateProject
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

/**
 * @api {put} /projects/:id Update project with id
 * @apiName UpdateProject
 * @apiGroup Projects
 *
 * @apiPermission canUpdateProject
 * 
 * @apiExample Usage:
 *  endpoint: http://localhost/api/projects/:id
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

/**
 * @api {delete} /projects/:id Delete project with id
 * @apiName DeleteProject
 * @apiGroup Projects
 * 
 * @apiPermission canDeleteProject
 *
 * @apiSuccess 204 Project was deleted
 */