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
                user: user
            });
        }
    }

    async actionUpdate() {
        const self = this;

        //user should be a object with all the values (new and old)
        let remoteData = self.param('user');
        let userId = self.param('id');

        let oldUser = null;
        let error = null;

        //get the old user
        try {
            oldUser = await self.db.User.findOne({
                where: {
                    id: userId
                },
                attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt'],
                include: self.db.User.extendInclude
            }).then(oldUser => {
                if (oldUser) {
                    //update the user in db
                    oldUser.update({
                        firstName: remoteData['firstName'],
                        lastName: remoteData['lastName'],
                        email: remoteData['email'],
                        passwordHash: remoteData['passwordHash'],
                        updatedAt: new Date()
                    });
                }
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
                oldUser: oldUser
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
                throw new Error('Could not find user with this email or password');
            }
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
                    throw new Error('Mail already in use');
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

        if (error !== null) {
            console.error(error);
            self.render({
                details: error
            }, {
                statusCode: 500
            });
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

        if (error !== null) {
            console.error(error);
            self.render({
                details: error
            }, {
                statusCode: 500
            });
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