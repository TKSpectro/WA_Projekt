const Passport = require('../core/passport.js');
module.exports = function(Model, db) {
    Model.extendInclude = [{
            model: db.Task,
            as: 'taskCreated',
            attributes: ['id', 'name', 'text'],
            limit: 1,
            separate: false
        },
        {
            model: db.Task,
            as: 'tasksAssignedTo',
            attributes: ['id', 'name', 'text'],
            separate: false
        }
    ];

    Model.prototype.fullname = function() {
        return this.firstName + ' ' + this.lastName;
    }

    Model.prototype.writeRemotes = function(data) {
        const self = this;

        if (typeof data.firstName !== 'undefined') {
            self.firstName = data.firstName;
        }

        if (typeof data.lastName !== 'undefined') {
            self.lastName = data.lastName;
        }

        if (typeof data.email === 'string') {
            self.email = data.email.toLowerCase();
        } else if (typeof data.email !== 'undefined') {
            self.email = data.email;
        }

        if (typeof data.password !== 'undefined') {
            self.passwordHash = Passport.hashPassword(data.password);
        }

        if (typeof data.permission !== 'undefined') {
            self.permission = data.permission;
        }

        if (typeof data.taskCreated !== 'undefined') {
            self.taskCreated = data.taskCreated;
        }

        if (typeof data.tasksAssignedTo !== 'undefined') {
            self.tasksAssignedTo = data.tasksAssignedTo;
        }
    }

};