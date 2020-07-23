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

        self.js('html5sortable');
        self.js('taskForm')
        self.js('index');

        self.css('index');

        const users = await self.db.User.findAll();
        //remove all deleted users
        for (let i = 0; i < users.length; ++i) {
            if (Helper.checkPermission(Helper.isUserDeleted, users[i].permission)) {
                users.splice(i, 1);
            }
        }

        if (!self.param('projectId')) {
            self.redirect('/project');
        } else {
            const projectId = self.param('projectId');

            const project = await self.db.Project.findAll({
                where: {
                    id: projectId
                },
            });

            const workflows = await self.db.Workflow.findAll({
                where: {
                    projectId: projectId
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
                        projectId: projectId
                    },
                    include: ['assignedTo'],
                    order: [
                        ['sort', 'ASC']
                    ]
                });
            }
            const projects = await self.db.Project.findAll();

            self.render({
                title: 'Project: ' + projectId,
                users: users,
                workflows: workflows,
                workflowTasks: workflowTasks

            });
        }
    }

    async actionProject() {
        const self = this;

        self.js('project');
        self.css('project');

        const projects = await self.db.Project.findAll();

        self.render({
            title: 'Project-Chooser',
            projects: projects,
        });
    }

    actionImprint() {
        const self = this;

        self.css('imprint');

        self.render({
            title: 'Imprint'
        });
    }

    actionPrivacy() {
        const self = this;

        self.css('privacy');

        self.render({
            title: 'Privacy'
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