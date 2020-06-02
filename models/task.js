module.exports = function (Model, db) {
    Model.extendInclude = [
        {
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
        }
    ];

    Model.prototype.writeRemotes = function (data) {
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

        if (typeof data.assignedToId !== 'undefined') {
            self.assignedToId = data.assignedToId;
        }

        if (typeof data.projectId !== 'undefined') {
            self.projectId = data.projectId;
        }
    }
};