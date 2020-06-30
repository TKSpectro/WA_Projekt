module.exports = function(Model, db){
    Model.extendInclude = [
        {
            model: db.Project,
            as: 'projectId',
            attributes: ['id'],
            limit: 1,
            separate: false
        }
    ];

    Model.prototype.writeRemotes = function (data) {
        const self = this;

        if (typeof data.name !== 'undefined') {
            self.name = data.name;
        }

        if (typeof data.color !== 'undefined') {
            self.color = data.color;
        }

        if (typeof data.sort !== 'undefined') {
            self.sort = data.sort;
        }

        if (typeof data.projectId !== 'undefined') {
            self.projectId = data.projectId;
        }
    }
};