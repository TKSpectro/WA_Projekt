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

        //TODO: needs to be refactored into its own function
        // should be callable from everywhere
        // fnc(...) <- takes parameter and returns if valid
        if (typeof data.name !== 'undefined') {
            self.name = data.name;
        }

        if (typeof data.color !== 'undefined') {
            self.color = data.color;
        }

        if (typeof data.sort !== 'undefined') {
            self.sort = data.sort;
        }
    }
};