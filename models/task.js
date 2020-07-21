module.exports = function(Model, db) {
    Model.extendInclude = [{
            model: db.User,
            as: 'creator',
            attributes: ['id', 'firstName', 'lastName'],
            limit: 1,
            separate: false
        },
        {
            model: db.User,
            as: 'assignedTo',
            attributes: ['id', 'firstName', 'lastName'],
            limit: 1,
            separate: false
        },
        {
            model: db.Project,
            as: 'project',
            attributes: ['id', 'name'],
            limit: 1,
            separate: false
        },
        {
            model: db.Workflow,
            as: 'workflow',
            attributes: ['id', 'name'],
            limit: 1,
            separate: false
        }
    ];

    Model.prototype.writeRemotes = function(data) {
        const self = this;

        if (typeof data.name !== 'undefined') {
            self.name = data.name;
        }

        if (typeof data.text !== 'undefined') {
            self.text = data.text;
        }

        if (typeof data.creatorId !== 'undefined') {
            self.creatorId = data.creatorId;
        }

        if (typeof data.creator !== 'undefined' && typeof data.creator.id !== 'undefined') {
            self.creatorId = data.creator.Id;
        }

        if (typeof data.assignedToId !== 'undefined') {
            self.assignedToId = data.assignedToId;
        }

        if (typeof data.assignedTo !== 'undefined' && typeof data.assignedTo.id !== 'undefined') {
            self.assignedToId = data.assignedTo.id;
        }

        if (typeof data.projectId !== 'undefined') {
            self.projectId = data.projectId;
        }

        if (typeof data.project !== 'undefined' && typeof data.project.id !== 'undefined') {
            self.projectId = data.project.id;
        }

        if (typeof data.maximumWorkTime !== 'undefined') {
            self.maximumWorkTime = data.maximumWorkTime;
        }
        if (typeof data.deadline !== 'undefined') {
            self.deadline = data.deadline;
        }

        if (typeof data.workflowId !== 'undefined') {
            self.workflowId = data.workflowId;
        }
    }
    Model.prototype.toJSON = function() {
        let obj = this.get({ plain: true });

        if (obj.creator && obj.creator.firstName && obj.creator.lastName) {
            obj.creator.displayName = obj.creator.firstName + ' ' + obj.creator.lastName;
        }

        if (obj.assignedTo && obj.assignedTo.firstName && obj.assignedTo.lastName) {
            obj.assignedTo.displayName = obj.assignedTo.firstName + ' ' + obj.assignedTo.lastName;
        }
        return obj;
    };
};