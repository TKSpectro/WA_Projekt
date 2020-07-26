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
    let _elmDesicription = null;
    let _elmCreatedBy = null;
    let _elmAssignedTo = null;
    let _elmMaxTime = null;
    let _elmEditButton = null;
    let _users = null;
    let _elmCreateButton = null;
    let _elmTitle = null;


    //Input Felder
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



        _elmDesicription = _dom.querySelector('.textTask');

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
    self.showWithTaskId = function(taskId) {
        if (taskId) {
            let xhr = new XMLHttpRequest();
            //handle request finished
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {

                    _elmEditButton.style.display = "block";
                    _elmCreateButton.style.display = "none";

                    _elmName.appendChild(_inputName);
                    _elmAssignedTo.appendChild(_inputSelect);
                    _elmCreatedBy.appendChild(_inputCreator);
                    _elmMaxTime.appendChild(_inputMaxTime);
                    _elmDeadline.appendChild(_inputDeadline);

                    let jsonData = JSON.parse(xhr.response);
                    _task = jsonData.task;


                    //to show a TaskForm
                    _dom.style.display = "block";

                    let deadline = _task.deadline.split("T");

                    // the name of the Task
                    _inputName.setAttribute("value", _task.name);
                    _inputName.readOnly = true;

                    // the name of the creator
                    _inputCreator.setAttribute("value", "Created By: " + _task.creator.displayName);
                    _inputCreator.readOnly = true;


                    // the maximum Time for a Task
                    _inputMaxTime.setAttribute("placeholder", 'Maximum Time: ' + _task.maximumWorkTime);
                    _inputMaxTime.readOnly = true;

                    // the Deadline Time for a Task
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
                    _elmDesicription.innerHTML = '';
                    let textarea = document.createElement("textarea");
                    textarea.innerHTML = _task.text;
                    _elmDesicription.appendChild(textarea);
                    createScEditor(textarea);
                    let instance = sceditor.instance(textarea);
                    _elmDesicription.innerHTML = instance.fromBBCode(instance.val());


                } else {
                    // ToDo 
                    console.log('request failed');
                }
            }

            let url = '/api/tasks/' + taskId;

            xhr.open('GET', url);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
        };



    };


    self.editMode = function(editMode) {

        if (editMode === true && _editMode === false) {

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
            _elmDesicription.innerHTML = '';
            _elmDesicription.appendChild(textarea);

            createScEditor(textarea);
            _elmDesicription.waTXT = textarea;

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
            let instance = sceditor.instance(_elmDesicription.waTXT);


            _elmDesicription.innerHTML = instance.fromBBCode(instance.val());
            _task.text = instance.val();
            _elmDesicription.waTXT = null;
            self.updateTask(_task);

        }


    }


    self.updateTask = function(task) {

        let xhr = new XMLHttpRequest();

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {

            } else {
                // ToDo falls das Request nicht klappt
                console.log('request failed');
            }
        };

        let url = '/api/tasks/' + task.id;

        xhr.open('PUT', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ task: task }));

    }

    let workflows = document.querySelectorAll('.row .add');
    for (let index = 0; index < workflows.length; index++) {

        const workflow = workflows[index];
        workflow.addEventListener('click', function(e) {
            //   taskForm.addTask(this.getAttribute('workflow-id'));


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
            _elmDesicription.innerHTML = ' ';
            _elmDesicription.appendChild(textarea);
            createScEditor(textarea);

            createTask.creatorId = user.getAttribute("user-id");
            createTask.projectId = window.location.href.split("=", )[1];
            createTask.workflowId = workflow.getAttribute("workflow-id");


        });


    }

    self.createTask = function() {

        /* let xhr = new XMLHttpRequest();

         xhr.onload = function() {
             if (xhr.status >= 200 && xhr.status < 300) {

             } else {
                 // ToDo falls das Request nicht klappt
                 console.log('Post request failed');
             }
         };

         let url = '/api/tasks';

         xhr.open('POST', url);
         xhr.setRequestHeader('Content-Type', 'application/json');
         xhr.send(JSON.stringify({ task: createTask }));*/

        io.emit('tasks/create', {
            task: createTask
        });

    }

    init();
}


function taskClose() {
    document.getElementById("taskCloseId").parentNode.parentNode.style.display = "none";
    _elmDesicription.innerHTML = ' ';


}