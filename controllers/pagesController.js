/**
 * @author Tom Käppler <tomkaeppler@web.de>
 * @version 1.0.0
 */

const Controller = require('./mainController.js')
const Helper = require('./api/helper.js');
class PagesController extends Controller {

    constructor(...args) {
        super(...args);
        const self = this;

        self.css('layout');

        self.before(['*', '-imprint', '-signin'], (next) => {
            if (self.req.authorized === true) {
                next();
            } else {
                self.redirect(self.urlFor('pages', 'signin'));
            }
        });

        self.before(['signin'], (next) => {
            if (self.req.authorized === true) {
                self.redirect(self.urlFor('pages', 'index'));
            } else {
                next();
            }
        });
    }

    actionIndex() {
        const self = this;
        self.css('index');
        self.js('index');

        self.db.User.findAll().then(users => {
            //remove all deleted user from the list
            for (let i = 0; i < users.length; ++i) {
                if (Helper.checkPermission(Helper.isUserDeleted, users[i].permission)){
                    users.splice(i, 1);
                }
            }
            self.render({
                title: 'Index',
                users: users,
                navigation: false,
            });
        });
    }

    actionImprint() {
        const self = this;

        self.render({
            title: 'Imprint'
        });
    }

    actionSignin() {
        const self = this;

        self.js('signin');
        self.css('signin');

        self.render({
            title: 'Login',
            navigation: false
        });
    }
}

module.exports = PagesController;