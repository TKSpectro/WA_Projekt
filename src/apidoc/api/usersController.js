/**
 * @api {get} /users Show all users
 * @apiName GetUsers
 * @apiGroup User
 *
 * @apiSuccess {Object[]} users             Array of users.
 *
 * @apiSuccess {Object} users.user                One user from the array.
 *
 * @apiSuccess {Number} users.user.id                  Users unique id.
 * @apiSuccess {String} users.user.firstName           Users firstname.
 * @apiSuccess {String} users.user.lastName            Users lastname.
 * @apiSuccess {String} users.user.email               Users email.
 * @apiSuccess {String} users.user.createdAt           Date of creation.
 * @apiSuccess {String} users.user.updatedAt           Date of last update.
 * @apiSuccess {Object[]} users.user.taskCreated       Array of tasks which the user created.
 * @apiSuccess {Object[]} users.user.tasksAssignedTo   Array of tasks which are assigned to the user.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "users": [
 *          {
 *              "id": 1,
 *              "firstName": "Tom",
 *              "lastName": "Käppler",
 *              "email": "t@mail.com",
 *              "createdAt": "2020-06-16T16:00:04.000Z",
 *              "updatedAt": "2020-06-16T16:00:04.000Z",
 *              "taskCreated": [
 *                  {
 *                      "id": 1,
 *                      "name": "First Task",
 *                      "text": "This is the first Task"
 *                  }
 *              ],
 *              "tasksAssignedTo": [
 *                  {
 *                      "id": 1,
 *                      "name": "First Task",
 *                      "text": "This is the first Task"
 *                  }
 *              ]
 *          },
 *          {
 *              "id": 2,
 *              "firstName": "Bilal",
 *              "lastName": "Alnaani",
 *              "email": "b@mail.com",
 *              "createdAt": "2020-06-16T16:00:04.000Z",
 *              "updatedAt": "2020-06-16T16:00:04.000Z",
 *              "taskCreated": [],
 *              "tasksAssignedTo": []
 *          }
 *      ]
 *  }
 */

/**
 * @api {get} /users/:id Show user with the id
 * @apiName GetUser
 * @apiGroup User
 *
 * @ApiParam {Number} id Users unique id
 *
 * @apiSuccess {Object} user                One user from the array.
 *
 * @apiSuccess {Number} user.id                  Users unique id.
 * @apiSuccess {String} user.firstName           Users firstname.
 * @apiSuccess {String} user.lastName            Users lastname.
 * @apiSuccess {String} user.email               Users email.
 * @apiSuccess {String} user.createdAt           Date of creation.
 * @apiSuccess {String} user.updatedAt           Date of last update.
 * @apiSuccess {Object[]} user.taskCreated       Array of tasks which the user created.
 * @apiSuccess {Object[]} user.tasksAssignedTo   Array of tasks which are assigned to the user.
 *
 * @apiError 404:UserNotFound The User with the <code>id</code> was not found.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "user": {
 *          "id": 1,
 *          "firstName": "Tom",
 *          "lastName": "Käppler",
 *          "email": "t@mail.com",
 *          "createdAt": "2020-06-16T16:00:04.000Z",
 *          "updatedAt": "2020-06-16T16:00:04.000Z",
 *          "taskCreated": [
 *              {
 *                  "id": 1,
 *                  "name": "First Task",
 *                  "text": "This is the first Task"
 *              }
 *          ],
 *          "tasksAssignedTo": [
 *              {
 *                  "id": 1,
 *                  "name": "First Task",
 *                  "text": "This is the first Task"
 *              }
 *          ]
 *      }
 *  }
 *
 */

/**
 * @api {post} /users Create a user
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiExample Usage:
 *      endpoint: http://localhost/api/users
 *
 *      json-body:
 *      {
 *          "user": {
 *              "firstName": "Post",
 *              "lastName": "Man",
 *              "email": "post@mail.com",
 *              "passwordHash": "$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2",
 *              "permission": 0
 *          }
 *      }
 *
 * @apiSuccess {Object} user                One user from the array.
 *
 * @apiSuccess {Number} user.permission          Users permission.
 * @apiSuccess {Number} user.id                  Users unique id.
 * @apiSuccess {String} user.firstName           Users firstname.
 * @apiSuccess {String} user.lastName            Users lastname.
 * @apiSuccess {String} user.email               Users email.
 * @apiSuccess {String} user.createdAt           Date of creation.
 * @apiSuccess {String} user.updatedAt           Date of last update.
 * @apiSuccess {Object[]} user.taskCreated       Array of tasks which the user created.
 * @apiSuccess {Object[]} user.tasksAssignedTo   Array of tasks which are assigned to the user.
 *
 * @apiError 404:UserNotFound The User with the <code>id</code> was not found.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "user": {
 *          "id": 1,
 *          "firstName": "Tom",
 *          "lastName": "Käppler",
 *          "email": "t@mail.com",
 *          "createdAt": "2020-06-16T16:00:04.000Z",
 *          "updatedAt": "2020-06-16T16:00:04.000Z"
 *      }
 *  }
 *
 */

/**
 * @api {post} /users/:id/update Update user with id
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiExample Usage:
 *      endpoint: http://localhost/api/users/:id/update
 *
 *      json-body:
 *      {
 *          "user": {
 *              "firstName": "Post",
 *              "lastName": "Man",
 *              "email": "post@mail.com",
 *              "passwordHash": "$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2",
 *              "permission": 0
 *          }
 *      }
 *
 * @apiSuccess {Object} user                One user from the array.
 *
 * @apiSuccess {Number} user.id                  Users unique id.
 * @apiSuccess {String} user.firstName           Users firstname.
 * @apiSuccess {String} user.lastName            Users lastname.
 * @apiSuccess {String} user.email               Users email.
 * @apiSuccess {Number} user.permission          Users permission.
 * @apiSuccess {String} user.createdAt           Date of creation.
 * @apiSuccess {String} user.updatedAt           Date of last update.
 *
 * @apiError 404:UserCouldNotBeUpdated The User with the <code>id</code> could not be updated.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "user": {
 *          "id": 1,
 *          "firstName": "Tom",
 *          "lastName": "Käppler",
 *          "email": "t@mail.com",
 *          "passwordHash": "hashedPassword"
 *          "createdAt": "2020-06-16T16:00:04.000Z",
 *          "updatedAt": "2020-06-16T16:00:04.000Z",
 *      }
 *  }
 *
 */

/**
 * @api {get} /users/:id/delete Delete user with id
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiError 404:UserCouldNotBeDeleted The User with the <code>id</code> could not be deleted.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      user: "deleted"
 *  }
 *
 */

/**
 * @api {post} /sigin Sigin as a user
 * @apiName Signin
 * @apiGroup User
 *
 * @apiExample Usage:
 *      endpoint: http://localhost/api/sigin
 *
 *      json-body:
 *      {
 *      	"user" : {
 *      		"email" : "t@mail.com",
 *      		"password" : "12345678"
 *      	}
 *      }
 *
 * @apiSuccess {String} token   jwt token for cookie.
 *
 * @apiError 404:UserNotFound Could not find user with this email or password.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI0ODQwOTM2MzIsImV4cCI6MTU5MjQ5ODQ5MzYzMiwiaWQiOjF9.dZAceitU9zRepMZ9j1C0gqfrYD1T_3Ndxao_oZWqyEg"
 *  }
 *
 */

/**
 * @api {post} /sigup Sigup as a user
 * @apiName Signup
 * @apiGroup User
 *
 * @apiExample Usage:
 *      endpoint: http://localhost/api/sigup
 *
 *      json-body:
 *      {
 *      	"user" : {
 *      		"firstName" : "Post",
 *      		"lastName" : "Man",
 *      		"email" : "post@mail.com",
 *      		"password" : "12345678"
 *      	}
 *      }
 *
 * @apiSuccess {Object} user                One user from the array.
 *
 * @apiSuccess {Number} user.permission          Users permission.
 * @apiSuccess {Number} user.id                  Users unique id.
 * @apiSuccess {String} user.firstName           Users firstname.
 * @apiSuccess {String} user.lastName            Users lastname.
 * @apiSuccess {String} user.email               Users email.
 * @apiSuccess {String} user.createdAt           Date of creation.
 * @apiSuccess {String} user.updatedAt           Date of last update.
 *
 * @apiError 404:UserNotFound Could not find user with this email or password.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 201 OK
 *  {
 *      "user": {
 *          "permission": 0,
 *          "id": 3,
 *          "firstName": "Post",
 *          "lastName": "Man",
 *          "email": "post@mail.com",
 *          "passwordHash": "$2b$10$U09i1GZ0GZttaNF5efMKZOQVtHBSLbQlB1FWVqQu.wR7Ih0YTfTsq",
 *          "updatedAt": "2020-06-18T12:43:09.774Z",
 *          "createdAt": "2020-06-18T12:43:09.774Z"
 *      }
 *  }
 *
 */

/**
 * @api {get} /signout Signout a user
 * @apiName Signout
 * @apiGroup User
 *
 * @apiError 404:UserNotFound Could not be logged out.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK{}
 *
 */