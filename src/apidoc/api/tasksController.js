/**
 * @api {get} /tasks Get all tasks
 * @apiName GetAllTasks
 * @apiGroup Tasks
 *
 * @apiSuccess {Object[]}   tasks             Array of Tasks.
 *
 * @apiSuccess {Object}     tasks.task                One Task from the array.
 *
 * @apiSuccess {Number}     tasks.task.id                                Tasks unique id.
 * @apiSuccess {String}     tasks.task.name                              Tasks name.
 * @apiSuccess {String}     tasks.task.text                              Tasks subject.
 * @apiSuccess {Number}     tasks.task.alreadyWorkTime                   Time which invested for a Task .
 * @apiSuccess {Number}     tasks.task.maximumWorkedTime                 Tasks maximum Time.
 * @apiSuccess {String}     tasks.task.deadline                          Tasks Deadline.
 * @apiSuccess {String}     tasks.task.createdAt                         Date of creation.
 * @apiSuccess {String}     tasks.task.updatedAt                         Date of last update.
 * @apiSuccess {Object}     tasks.task.AssignedTo                        User to whom the task is assigned.
 * @apiSuccess {Object}     tasks.task.project                           Tasks project 
 * @apiSuccess {Object}     tasks.task.workflow                          Tasks workflow
 *
 * @apiError 404: TasksNotFound No tasks were found.
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *  "tasks": [
 *       {
 *           "id": 1,
 *           "name": "First Task",
 *           "text": "This is the first Task",
 *           "alreadyWorkedTime": 0,
 *           "maximumWorkTime": 120,
 *           "deadline": "2020-07-03T13:45:03.000Z",
 *           "createdAt": "2020-07-03T13:45:03.000Z",
 *           "updatedAt": "2020-07-04T13:20:45.000Z",
 *           "creator": {
 *               "id": 1,
 *               "firstName": "Tom",
 *               "lastName": "Käppler"
 *           },
 *           "assignedTo": {
 *              "id": 1,
 *               "firstName": "Tom",
 *               "lastName": "Käppler"
 *           },
 *          "project": {
 *              "id": 1,
 *              "name": "First Project"
 *          },
 *          "workflow": {
 *              "id": 1
 *          }
 *      },
 *      {
 *          "id": 2,
 *          "name": "Second Task",
 *          "text": "This is the second Task",
 *          "alreadyWorkedTime": 60,
 *          "maximumWorkTime": 120,
 *          "deadline": "2020-07-03T13:45:03.000Z",
 *          "createdAt": "2020-07-03T13:45:03.000Z",
 *          "updatedAt": "2020-07-03T18:19:20.000Z",
 *          "creator": {
 *              "id": 1,
 *              "firstName": "Tom",
 *              "lastName": "Käppler"
 *          },
 *          "assignedTo": {
 *              "id": 2,
 *              "firstName": "Bilal",
 *              "lastName": "Alnaani"
 *          },
 *          "project": {
 *              "id": 1,
 *              "name": "First Project"
 *          },
 *           "workflow": {
 *               "id": 2
 *          }
 *       }
 *   ]
 * }
 * 
 */
/**
 * @api {get} /tasks/:id Get task with id
 * @apiName GetTaskWithId
 * @apiGroup Tasks
 *
 * @ApiParam {Number} id Tasks unique id
 *
 * @apiSuccess {Object}     tasks.task                One Task from the array.
 *
 * @apiSuccess {Number}     tasks.task.id                                Tasks unique id.
 * @apiSuccess {String}     tasks.task.name                              Tasks name.
 * @apiSuccess {String}     tasks.task.text                              Tasks subject.
 * @apiSuccess {Number}     tasks.task.alreadyWorkTime                   Time which invested for a Task .
 * @apiSuccess {Number}     tasks.task.maximumWorkedTime                 Tasks maximum Time.
 * @apiSuccess {String}     tasks.task.deadline                          Tasks Deadline.
 * @apiSuccess {String}     tasks.task.createdAt                         Date of creation.
 * @apiSuccess {String}     tasks.task.updatedAt                         Date of last update.
 * @apiSuccess {Object}     tasks.task.AssignedTo                        User to whom the task is assigned.
 * @apiSuccess {Object}     tasks.task.project                           Tasks project.
 * @apiSuccess {Object}     tasks.task.workflow                          Tasks workflow.
 *
 * @apiError 404: TaskNotFound The Task with the <code>id</code> was not found.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  
 *      "task": {
 *           "id": 1,
 *           "name": "First Task",
 *           "text": "This is the first Task",
 *           "alreadyWorkedTime": 0,
 *           "maximumWorkTime": 120,
 *           "deadline": "2020-07-03T13:45:03.000Z",
 *           "createdAt": "2020-07-03T13:45:03.000Z",
 *           "updatedAt": "2020-07-04T13:20:45.000Z",
 *           "creator": {
 *               "id": 1,
 *               "firstName": "Tom",
 *               "lastName": "Käppler"
 *           },
 *           "assignedTo": {
 *              "id": 1,
 *               "firstName": "Tom",
 *               "lastName": "Käppler"
 *           },
 *          "project": {
 *              "id": 1,
 *              "name": "First Project"
 *          },
 *          "workflow": {
 *              "id": 1
 *          }
 *      }
 * }
 *
 */
/**
 * @api {post} /tasks Create task
 * @apiName CreateTask
 * @apiGroup Tasks
 * 
 * @apiPermission userWithRightsToCreateTask
 *
 *
 * @apiExample Usage:
 *      endpoint: http://localhost/api/tasks
 *
 *      json-body:
 *       {
 *      "task": {
 *           "name": "First Task",
 *           "text": "This is the first Task",
 *           "maximumWorkTime": 120,
 *           "deadline":    "2020-07-03T13:45:03.000Z",
 *           "creator":     1,
 *           "assignedTo":   1,
 *           "project":     1,
 *           "workflow":    1 
 *      }
 *  }
 *
 * @apiSuccess {Object} task                One task from the array.
 *
 * @apiSuccess {Number}     tasks.task.id                                Tasks unique id.
 * @apiSuccess {String}     tasks.task.name                              Tasks name.
 * @apiSuccess {String}     tasks.task.text                              Tasks subject.
 * @apiSuccess {Number}     tasks.task.alreadyWorkedTime                 Time which invested for a Task .
 * @apiSuccess {Number}     tasks.task.maximumWorkTime                   Tasks maximum Time.
 * @apiSuccess {String}     tasks.task.deadline                          Tasks Deadline.
 * @apiSuccess {String}     tasks.task.createdAt                         Date of creation.
 * @apiSuccess {String}     tasks.task.updatedAt                         Date of last update.
 * @apiSuccess {Object}     tasks.task.AssignedTo                        Users assigned task.
 * @apiSuccess {Object}     tasks.task.project                           Tasks project. 
 * @apiSuccess {Object}     tasks.task.workflow                          Tasks workflow.
 * @apiSuccess {Number}     tasks.task.sort                              Tasks order.
 * 
 * @apiError 403:Forbidden Logged in user does not have the permission to update tasks. 
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *      "task": {
 *           "id": 1,
 *           "name": "First Task",
 *           "text": "This is the first Task",
 *           "alreadyWorkedTime": 0,
 *           "maximumWorkTime": 120,
 *           "deadline": "2020-07-03T13:45:03.000Z",
 *           "createdAt": "2020-07-03T13:45:03.000Z",
 *           "updatedAt": "2020-07-04T13:20:45.000Z",
 *           "creator": 1,
 *           "assignedTo": 1,
 *           "project": 1 ,
 *           "workflow": 1,
 *           "sort": 9999999,
 * }
 */
/**
 * @api {put} /tasks/:id Update task with id
 * @apiName UpdateTaskWithId
 * @apiGroup Tasks
 *
 * @ApiParam {Number} id Tasks unique id
 * 
 * @apiPermission  canUpdateTask
 * 
 * @apiExample Usage:
 *      endpoint: http://localhost/api/tasks/:id
 *
 *      json-body:
 *      {
 *          "task": {
 *            "name": "updatedTask",
 *            "text": "updatedTask Text",
 *            "assignedTo":   1,
 *            "project":     1
 *          }
 *      }
 *
 * @apiSuccess {Object} user                One user from the array.
 *
 * @apiSuccess {Number}     tasks.task.id                                Tasks unique id.
 * @apiSuccess {String}     tasks.task.name                              Tasks name.
 * @apiSuccess {String}     tasks.task.text                              Tasks subject.
 * @apiSuccess {Number}     tasks.task.alreadyWorkTime                   Time which invested for a Task .
 * @apiSuccess {Number}     tasks.task.maximumWorkedTime                 Tasks maximum Time.
 * @apiSuccess {String}     tasks.task.deadline                          Tasks Deadline.
 * @apiSuccess {String}     tasks.task.createdAt                         Date of creation.
 * @apiSuccess {String}     tasks.task.updatedAt                         Date of last update.
 * @apiSuccess {Object}     tasks.task.AssignedTo                        User to whom the task is assigned.
 * @apiSuccess {Object}     tasks.task.project                           Tasks project. 
 * @apiSuccess {Object}     tasks.task.workflow                          Tasks workflow.
 * @apiSuccess {Number}     tasks.task.sort                              Tasks order.
 *
 * @apiError 403:Forbidden Logged in user does not have the permission to update tasks.
 * @apiError 404:TaskCouldNotBeUpdated Task with the <code>id</code> could not be updated.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 202 OK
 *  {
 *      "task": {
 *           "id": 1,
 *           "name": "updatedTask",
 *           "text": "updatedTask Text",
 *           "alreadyWorkedTime": 0,
 *           "maximumWorkTime": 120,
 *           "deadline": "2020-07-03T13:45:03.000Z",
 *           "createdAt": "2020-07-03T13:45:03.000Z",
 *           "updatedAt": "2020-07-04T13:20:45.000Z",
 *           "creator": 1,
 *           "assignedTo": 1,
 *           "project": 1 ,
 *           "workflow": 1,
 *           "sort": 0,
 *      }
 *  }
 */
/**
 * @api {delete} /tasks/:id Delete task with id
 * @apiName DeleteTask
 * @apiGroup Tasks
 * 
 * @ApiParam {Number} id Tasks unique id
 *
 * @apiPermission userWithRightsToDeleteTask
 * 
 * @apiError 403:Forbidden Logged in user does not have the permission to delete tasks.
 * @apiError 404:TaskCouldNotBeDeleted The Task with the <code>id</code> could not be deleted.
 *
 * @apiSuccess Success 204
 *
 */