function Taskform(opts) {
    let self = this;

    opts = Object.assign({
        id: 'slide-in-popover',


    }, opts);

    let _editMode = false; //stores the current edit mode active or not.
    let _task = null; //current selected task
    let createTask = {};

    let _dom = null;
    let _elmDeadline = null;
    let _elmName = null;
    let _elmDescription = null;
    let _elmCreatedBy = null;
    let _elmAssignedTo = null;
    let _elmMaxTime = null;
    let _elmEditButton = null;
    let _users = null;
    let _elmCreateButton = null;
    let _elmTitle = null;

    //inputs
    let _inputName = document.createElement("INPUT");
    let _inputCreator = document.createElement("INPUT");
    let _inputDeadline = document.createElement("INPUT");
    let _inputMaxTime = document.createElement("INPUT");
    let _inputSelect = document.createElement("select");
    let textarea = document.createElement("textarea");

    function init() {
        _dom = document.getElementById(opts.id);

        _elmTitle = _dom.querySelector('.createTask');

        _elmName = _dom.querySelector('.nameTask');
        _elmCreateButton = _dom.querySelector('.addTask');

        _elmAssignedTo = _dom.querySelector('.assigned-to');
        _inputSelect.setAttribute("id", "mySelect");

        _elmDescription = _dom.querySelector('.textTask');

        _elmCreatedBy = _dom.querySelector('.Created-by');

        _elmMaxTime = _dom.querySelector('.maxTime');
        _inputMaxTime.setAttribute("type", "number");

        _users = document.querySelectorAll('.menu-list .user');

        _elmDeadline = _dom.querySelector('.deadline');

        _elmEditButton = _dom.querySelector('.addTaskButton');

        _elmEditButton.addEventListener('click', () => {
            self.editMode(!_editMode);

            if (_editMode === true) {
                _elmEditButton.innerText = 'Save Task';
            } else {
                _elmEditButton.innerText = 'Edit Task';
            }
        });

        _elmCreateButton.addEventListener('click', () => {

            createTask.name = _inputName.value;
            createTask.maximumWorkTime = _inputMaxTime.value;
            createTask.deadline = _inputDeadline.value;
            createTask.assignedToId = _inputSelect.value;

            let instance = sceditor.instance(textarea);
            textarea.value = instance.val();
            createTask.text = textarea.value;
            self.createTask();
            _dom.style.display = "none";
        });
    }

    function createScEditor(textarea) {
        sceditor.create(textarea, {
            format: 'bbcode',
            emoticonsEnabled: false,
            toolbar: 'bold,italic,underline|source',
            style: 'assets/libs/sceditor/minified/themes/content/default.min.css'
        });
    }

    // public method
    self.showWithTaskId = function (taskId) {
        if (taskId) {
            let xhr = new XMLHttpRequest();
            //handle request finished
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {

                    _elmTitle.innerHTML = "Edit Task";
                    _elmEditButton.style.display = "block";
                    _elmCreateButton.style.display = "none";

                    _elmName.appendChild(_inputName);
                    _elmAssignedTo.appendChild(_inputSelect);
                    _elmCreatedBy.appendChild(_inputCreator);
                    _elmMaxTime.appendChild(_inputMaxTime);
                    _elmDeadline.appendChild(_inputDeadline);

                    let jsonData = JSON.parse(xhr.response);
                    _task = jsonData.task;

                    // show the taskform
                    _dom.style.display = "block";

                    let deadline = _task.deadline.split("T");

                    // the name of the task
                    _inputName.setAttribute("value", _task.name);
                    _inputName.readOnly = true;

                    // the name of the creator
                    _inputCreator.setAttribute("value", "Created By: " + _task.creator.displayName);
                    _inputCreator.readOnly = true;


                    // the maximum time for a task
                    _inputMaxTime.setAttribute("placeholder", 'Maximum Time: ' + _task.maximumWorkTime);
                    _inputMaxTime.readOnly = true;

                    // the deadline time for a task
                    _inputDeadline.setAttribute("placeholder", "Deadline: " + deadline[0]);
                    _inputDeadline.readOnly = true;

                    // the content of select 
                    if (!_inputSelect.length) {
                        for (let index = 0; index < _users.length; index++) {
                            const element = _users[index];
                            let option = document.createElement("option");
                            option.setAttribute("value", element.getAttribute('data-id'));
                            let value = document.createTextNode("Assigned To: " + element.getAttribute('data-fullname'));
                            option.appendChild(value);
                            document.getElementById("mySelect").appendChild(option);
                        }
                    }

                    _inputSelect.selectedIndex = _task.assignedTo.id - 1;
                    _inputSelect.disabled = true;
                    _elmDescription.innerHTML = '';
                    let textarea = document.createElement("textarea");
                    textarea.innerHTML = _task.text;
                    _elmDescription.appendChild(textarea);
                    createScEditor(textarea);
                    let instance = sceditor.instance(textarea);
                    _elmDescription.innerHTML = instance.fromBBCode(instance.val());

                } else {
                    console.log('request failed');
                }
            }
            let url = '/api/tasks/' + taskId;

            xhr.open('GET', url);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
        };
    };

    self.editMode = function (editMode) {

        if (editMode === true && _editMode === false) {
            _elmTitle.innerHTML = "Edit Task";
            _editMode = true;
            _inputName.readOnly = false;
            _inputSelect.disabled = false;
            _inputMaxTime.readOnly = false;
            _inputDeadline.readOnly = false;


            _inputDeadline.setAttribute("type", "date");

            let textarea = document.createElement("textarea");
            textarea.style.width = '100%';
            textarea.style.height = "100%";
            textarea.style.boxSizing = "border-box%";
            textarea.innerHTML = _task.text;
            _elmDescription.innerHTML = ' ';
            _elmDescription.appendChild(textarea);

            createScEditor(textarea);
            _elmDescription.waTXT = textarea;

        } else if (_editMode === true) {

            _task.name = _inputName.value;
            _task.assignedToId = _inputSelect.value;

            if (!_inputMaxTime.value || !_task.deadline) {
                _task.maximumWorkTime = _task.maximumWorkTime;
                _task.deadline = _task.deadline;

            } else {
                _task.maximumWorkTime = _inputMaxTime.value;
                _task.deadline = _inputDeadline.value;
            }
            _editMode = false;
            let instance = sceditor.instance(_elmDescription.waTXT);

            _elmDescription.innerHTML = instance.fromBBCode(instance.val());
            _task.text = instance.val();
            _elmDescription.waTXT = null;
            self.updateTask(_task);
        }
    }

    self.updateTask = function (task) {

        let xhr = new XMLHttpRequest();

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
            } else {
                console.log('request failed');
            }
        };

        let url = '/api/tasks/' + task.id;

        xhr.open('PUT', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ task: task }));
    }

    // Add a Task
    let workflows = document.querySelectorAll('.row .add');
    for (let index = 0; index < workflows.length; index++) {

        const workflow = workflows[index];
        workflow.addEventListener('click', function (e) {
            _inputName.value = "";
            _inputMaxTime.value = "";
            _inputDeadline.value = "";
            _elmTitle.innerHTML = "Add Task";

            _editMode = true;
            _inputName.readOnly = false;
            _inputSelect.disabled = false;
            _inputMaxTime.readOnly = false;
            _inputDeadline.readOnly = false;
            let user = document.querySelector(".taskForm");

            _elmEditButton.style.display = "none";
            _elmCreateButton.style.display = "block";
            _elmName.appendChild(_inputName);
            _elmAssignedTo.appendChild(_inputSelect);
            _elmCreatedBy.appendChild(_inputCreator);
            _elmMaxTime.appendChild(_inputMaxTime);
            _elmDeadline.appendChild(_inputDeadline);
            _dom.style.display = "block";
            _inputName.setAttribute("placeholder", "The Task Name");
            _inputCreator.setAttribute("value", "Creator: " + user.getAttribute("user-name"));
            _inputMaxTime.setAttribute("placeholder", "Maximum Work Time");
            _inputDeadline.setAttribute("type", "date");

            if (!_inputSelect.length) {
                for (let index = 0; index < _users.length; index++) {
                    const element = _users[index];
                    let option = document.createElement("option");
                    option.setAttribute("value", element.getAttribute('data-id'));
                    let value = document.createTextNode("Assigned To: " + element.getAttribute('data-fullname'));
                    option.appendChild(value);
                    document.getElementById("mySelect").appendChild(option);
                    _inputSelect.disabled = false;

                }
            }

            // Text Area with Editor
            textarea.style.width = '100%';
            textarea.style.height = '100%';
            textarea.style.boxSizing = "border-box%";

            textarea.innerHTML = " ";
            _elmDescription.innerHTML = ' ';
            _elmDescription.appendChild(textarea);
            createScEditor(textarea);

            createTask.creatorId = user.getAttribute("user-id");
            createTask.projectId = workflow.getAttribute("project-id");
            createTask.workflowId = workflow.getAttribute("workflow-id");
        });
    }

    self.createTask = function () {
        if (createTask.name === '' || createTask.maximumWorkTime === '' || createTask.deadline === '') {
            alert('cant create task: Task info is missing');
        } else {
            io.emit('tasks/create', {
                task: createTask
            });
            location.reload();
        }
    }

    init();
}

function taskClose() {
    document.getElementById("taskCloseId").parentNode.parentNode.style.display = "none";
    let _elmDescription = document.querySelector('.textTask');

    _elmDescription.innerHTML = ' ';
}