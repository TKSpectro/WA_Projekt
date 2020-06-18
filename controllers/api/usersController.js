/**
 * @author Tom Käppler <tomkaeppler@web.de>
 * @version 1.0.0
 */

const Controller = require('../mainController.js');
const Passport = require('../../core/passport.js');
const ApiError = require('../../core/error.js');

class ApiUsersController extends Controller {

    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        self.before(['*', '-signin', '-signup'], function (next) {
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
    async actionIndex() {
        const self = this;

        let users = [];
        let error = null;

        try {
            users = await self.db.User.findAll({
                where: {},
                attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt'],
                include: self.db.User.extendInclude
            });
            if (!users) {
                throw new ApiError('No users found', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                users: users
            }, {
                statusCode: 200
            });
        }
    }

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
    async actionShow() {
        const self = this;

        let userId = self.param('id');
        let user = null;
        let error = null;

        try {
            user = await self.db.User.findOne({
                where: {
                    id: userId
                },
                attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt'],
                include: self.db.User.extendInclude
            });
            if (!user) {
                throw new ApiError('No user found with this id', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                user: user
            });
        }
    }

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
    async actionCreate() {
        const self = this;

        let remoteData = self.param('user');

        let user = null;
        let error = null;

        try {
            user = await self.db.sequelize.transaction(async (t) => {
                let newUser = self.db.User.build();
                newUser.writeRemotes(remoteData);

                await newUser.save({
                    transaction: t
                });

                return newUser;
            });
            if (!user) {
                throw new ApiError('Could not create user', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                user: user
            });
        }
    }

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
    async actionUpdate() {
        const self = this;

        //user should be a object with all the values (new and old)
        let remoteData = self.param('user');
        let userId = self.param('id');

        let user = null;
        let error = null;

        //get the old user
        try {
            user = await self.db.sequelize.transaction(async (t) => {
                let updatedUser = await self.db.User.findOne({
                    where: {
                        id: userId
                    }
                }, { transaction: t })
                if (updatedUser) {
                    await updatedUser.update({
                        firstName: remoteData['firstName'],
                        lastName: remoteData['lastName'],
                        email: remoteData['email'],
                        passwordHash: remoteData['passwordHash'],
                        permission: remoteData['permission'],
                        updatedAt: new Date()
                    }, {
                        where: {
                            id: userId
                        }
                    }, { transaction: t });
                }

                return updatedUser;
            });
            if (!user) {
                throw new ApiError('User could not be updated', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                user: user
            });
        }
    }

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
    async actionDelete() {
        // user wont actually be deleted but will get anonymized
        // firstName -> 'deleted'
        // lastName -> 'deleted'
        // email -> 'deleted'
        // password -> 'deleted'
        const self = this;
        let userId = self.param('id');

        let user = null;
        let error = null;

        //get the old user
        try {
            user = await self.db.sequelize.transaction(async (t) => {
                let updatedUser = await self.db.User.findOne({
                    where: {
                        id: userId
                    }
                }, { transaction: t })
                if (updatedUser) {
                    await updatedUser.update({
                        firstName: 'deleted',
                        lastName: 'deleted',
                        email: 'deleted',
                        passwordHash: 'deleted',
                        permission: 0,
                        updatedAt: new Date()
                    }, {
                        where: {
                            id: userId
                        }
                    }, { transaction: t });
                }

                return updatedUser;
            });
            if (!user) {
                throw new ApiError('User could not be deleted', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                user: 'deleted'
            });
        }
    }

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
    async actionSignin() {
        const self = this;

        let remoteData = self.param('user') || {};

        let user = null;
        let error = null;

        try {
            user = await self.db.User.findOne({
                where: {
                    email: remoteData.email
                }
            });
            if (!user || !Passport.comparePassword(remoteData.password, user.passwordHash)) {
                throw new ApiError('Could not find user with this email or password', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            let token = Passport.authorizeUserWithCookie(self.req, self.res, user.id);

            self.render({
                token: token
            }, {
                statusCode: 200
            });
        }
    }

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
    async actionSignup() {
        const self = this;

        let remoteData = self.param('user');
        let user = null;
        let error = null;

        try {
            user = await self.db.sequelize.transaction(async (t) => {

                let sameMail = await self.db.User.findOne({
                    where: {
                        email: remoteData.email
                    },
                    lock: true,
                    transaction: t
                });

                if (sameMail) {
                    throw new ApiError('Mail already in use', 400);
                }

                let newUser = self.db.User.build();
                newUser.writeRemotes(remoteData);
                await newUser.save({
                    transaction: t
                });

                return newUser;
            });
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                user: user
            }, {
                statusCode: 201
            });
        }

    }

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
    async actionSignout() {
        const self = this;

        let error = null;

        if (error) {
            self.handleError(error);
        } else {
            Passport.unauthorizeUser(self.req, self.res);

            self.render();
        }
    }
}

module.exports = ApiUsersController;