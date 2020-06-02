/**
 * 
 */

const Controller = require('../core/controller.js');
const Passport = require('../core/passport.js');

class MainController extends Controller {
    constructor(...args) {
        super(...args);

        const self = this;

        // set default unauthorized
        self.req.authorized = false;
        self.req.user = null;

        self.before(['*'], async (next) => {
            let tokenPayload = Passport.isAuthorized(self.req);
            if (tokenPayload !== false) {
                self.db.User.findOne({
                    where: {
                        id: tokenPayload.id
                    }
                }).then(function (user) {
                    if (user) {
                        self.req.user = user;
                        self.req.authorized = true;
                    }
                    next();
                }).catch(function (err) {
                    console.log(err);
                    next();
                });
            } else {
                next();
            }
        });
    }
}

module.exports = MainController;