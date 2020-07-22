function updateUserPressed(elm) {
    alert('UPDATE');
}

io.on('user/cantDelete', (data) => {
    alert('Could not delete User because he is referenced somewhere');
});

io.on('user/wasDeleted', (data) => {
    alert('User got deleted');
    location.reload(true);
});

io.on('user/wasUpdated', (data) => {
    alert('User was updated');
});

function deleteUserPressed(elm) {
    if (confirm('Are you sure you want to delete this user?')) {
        io.emit('user/delete', {
            id: elm.getAttribute('user-id'),
        });

    } else {
        // Do nothing
    }
}

function updateUserPressed(elm) {
    let _firstName = document.getElementById("firstName" + elm.getAttribute("user-id"));
    _firstName.disabled = !_firstName.disabled;

    let _lastName = document.getElementById("lastName" + elm.getAttribute("user-id"));
    _lastName.disabled = !_lastName.disabled;

    let _email = document.getElementById("email" + elm.getAttribute("user-id"));
    _email.disabled = !_email.disabled;

    let _permission = document.getElementById("permission" + elm.getAttribute("user-id"));
    _permission.disabled = !_permission.disabled;

    let _update = document.getElementById("update" + elm.getAttribute("user-id"));

    if(!_email.disabled){
        _update.innerText = " SEND ";
    }else{
        _update.innerText = "UPDATE";

        if (confirm('Are you sure you want to update this user?')) {
            io.emit('user/update', {
                id: elm.getAttribute('user-id'),
                firstName: _firstName.value,
                lastName: _lastName.value,
                email: _email.value,
                permission: _permission.value,
            });
        } else {
            // Do nothing
        }
    }
}

function calc_permission() {
    let total = 0;

    if (document.permission.dUser.checked == true) { total += 256 }
    if (document.permission.uUser.checked == true) { total += 128 }

    if (document.permission.dTask.checked == true) { total += 64 }
    if (document.permission.uTask.checked == true) { total += 32 }
    if (document.permission.cTask.checked == true) { total += 16 }

    if (document.permission.dProject.checked == true) { total += 8 }
    if (document.permission.uProject.checked == true) { total += 4 }
    if (document.permission.cProject.checked == true) { total += 2 }

    if (document.permission.isDeleted.checked == true) { total += 1 }

    document.permission.permission_total.value = total;
    document.permission.binary_total.value = (total >>> 0).toString(2);;
}