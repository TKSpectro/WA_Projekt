//DEFINE all permissions which are available
exports.canDeleteUser       = '0000000100000000';
exports.canUpdateUser       = '0000000010000000';
exports.canDeleteTask       = '0000000001000000';
exports.canUpdateTask       = '0000000000100000';
exports.canCreateTask       = '0000000000010000';
exports.canDeleteProject    = '0000000000001000';
exports.canUpdateProject    = '0000000000000100';
exports.canCreateProject    = '0000000000000010';
exports.isUserDeleted       = '0000000000000001';

exports.checkPermission = (permission, userPermission) => {
    return (parseInt(permission, 2) & userPermission) > 0;
};