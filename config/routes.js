/**
 * @author Tom Käppler <tomkaeppler@web.de>
 * @version 1.0.0
 */

const PagesController = require('../controllers/pagesController.js');
const ApiUsersController = require('../controllers/api/usersController.js');
const ApiTasksController = require('../controllers/api/tasksController.js');
const ApiMessagesController = require('../controllers/api/messagesController.js');
const ApiProjectsController = require('../controllers/api/projectsController.js');

let routes = {
    'pages': {
        controller: PagesController,
        actions: [
            { path: '/', action: 'index', method: 'get' },
            { path: '/imprint', action: 'imprint', method: 'get' },
            { path: '/signin', action: 'signin', method: 'get' }
        ]
    },
    'api/users' : {
        controller: ApiUsersController,
        actions: [
            { path: '/api/users', action:'index', method: 'GET'},
            { path: '/api/signin', action:'signin', method: 'POST'},
            { path: '/api/signup', action:'signup', method: 'POST'},
            { path: '/api/signout', action:'signout', method: 'POST'},
            { path: '/api/users', action:'create', method: 'POST'},
            { path: '/api/users/:id', action:'show', method: 'GET'}
        ]
    },
    'api/tasks' : {
        controller: ApiTasksController,
        actions: [
            { path: '/api/tasks', action:'index', method: 'GET'},
            { path: '/api/tasks', action:'create', method: 'POST'},
            { path: '/api/tasks/:id', action:'show', method: 'GET'}
        ]
    },
    'api/messages' : {
        controller: ApiMessagesController,
        actions: [
            { path: '/api/messages', action:'index', method: 'GET'},
            { path: '/api/messages', action:'create', method: 'POST'},
            { path: '/api/messages/:id', action:'show', method: 'GET'}
        ]
    },
    'api/projects' : {
        controller: ApiProjectsController,
        actions: [
            { path: '/api/projects', action:'index', method: 'GET'},
            { path: '/api/projects', action:'create', method: 'POST'},
            { path: '/api/projects/:id', action:'show', method: 'GET'}
        ]
    },
    
}

module.exports = routes;