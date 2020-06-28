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

    async actionIndex() {
        const self = this;
        self.js('html5sortable')
        self.js('index');

        self.css('index');
        
        const users = await self.db.User.findAll();
        //remove all deleted users
        for (let i = 0; i < users.length; ++i) {
            if (Helper.checkPermission(Helper.isUserDeleted, users[i].permission)) {
                users.splice(i, 1);
            }
        }
        const workflows = await self.db.Workflow.findAll({
            where: {
                projectId: 1
            },
            order: [
                ['sort', 'ASC']
            ]
        });
        
        const workflowTasks = {};

        for (let index = 0; index < workflows.length; index++) {
            const workflow = workflows[index];
            workflowTasks[workflow.id] = await self.db.Task.findAll({
                where: {
                    workflowId: workflow.id,
                    projectId: 1
                },
                include: ['assignedTo']
            });
        }

        self.render({
            title: 'Kanban Project 1',
            users: users,
            workflows: workflows,
            workflowTasks: workflowTasks,
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