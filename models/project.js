module.exports = function (Model, db) {
    Model.extendInclude = [
        {
            model: db.Task,
            as: 'tasks',
            attributes: ['id', 'name', 'text'],
            limit: 1,
            separate: false
        }
    ];

    Model.prototype.writeRemotes = function (data) {
        const self = this;

        if (typeof data.name !== 'undefined') {
            self.name = data.name;
        }

        if (typeof data.tasks !== 'undefined') {
            self.tasks = data.tasks;
        }
    }
};