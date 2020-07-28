function updateUserPressed(elm) {
    alert('UPDATE');
}

function returnToIndex(){
    location.replace('/');
}

io.on('user/cantDelete', (data) => {
    alert('Could not delete User because he is referenced somewhere');
});

io.on('user/wasDeleted', (data) => {
    location.reload(true);
});

io.on('user/wasUpdated', (data) => {
    location.reload(true);
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
    let _permission_calculator = document.getElementById("permission_calculator");

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

        _permission_calculator.classList.add("show");

        let id = _permission_calculator.setAttribute("user-id", elm.getAttribute("user-id"));
    }else{
        _update.innerText = "UPDATE";
        _permission_calculator.classList.remove("show");
        _permission_calculator.removeAttribute("user-id");
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

    let calc = document.permission_calculator;

    if (calc.dUser.checked == true) { total += 256 }
    if (calc.uUser.checked == true) { total += 128 }

    if (calc.dTask.checked == true) { total += 64 }
    if (calc.uTask.checked == true) { total += 32 }
    if (calc.cTask.checked == true) { total += 16 }

    if (calc.dProject.checked == true) { total += 8 }
    if (calc.uProject.checked == true) { total += 4 }
    if (calc.cProject.checked == true) { total += 2 }

    if (calc.isDeleted.checked == true) { total += 1 }

    document.getElementById("permission" + document.getElementById('permission_calculator').getAttribute("user-id")).value = total;
}