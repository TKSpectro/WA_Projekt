module.exports = function (Model, db) {
    Model.extendInclude = [
        {
            model: db.User,
            as: 'from',
            attributes: ['id', 'firstName', 'lastName', 'email'],
            limit: 1,
            separate: false
        },
        {
            model: db.User,
            as: 'to',
            attributes: ['id', 'firstName', 'lastName', 'email'],
            limit: 1,
            separate: false
        }
    ];

    Model.prototype.writeRemotes = function (data) {
        const self = this;

        //TODO: needs to be refactored into its own function
        // should be callable from everywhere
        // fnc(...) <- takes parameter and returns if valid
        if (typeof data.text !== 'undefined') {
            self.text = data.text;
        }

        if (typeof data.fromId !== 'undefined') {
            self.fromId = data.fromId;
        }

        if (typeof data.toId !== 'undefined') {
            self.toId = data.toId;
        }
    }
};