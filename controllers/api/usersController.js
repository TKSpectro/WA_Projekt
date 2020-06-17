/**
 * @author Tom Käppler <tomkaeppler@web.de>
 * @version 1.0.0
 */

const Controller = require('../mainController.js');
const Passport = require('../../core/passport.js');

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
            });
        }
    }

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
                statusCode: 201
            });
        }
    }

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

    async actionSignout() {
        const self = this;

        let error = null;

        if (error) {
            self.handleError(error);
        } else {
            Passport.unauthorizeUser(self.req, self.res);

            self.render({
                loggedOut: "yes"
            }, {
                statusCode: 201
            });
        }
    }
}

module.exports = ApiUsersController;