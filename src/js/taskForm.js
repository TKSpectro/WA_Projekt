function Taskform(opts) {
    let self = this;


    opts = Object.assign({
        id: 'slide-in-popover',


    }, opts);



    let _shown = false; //stores the current display state.
    let _editMode = false; //stores the current edit mode active or not.
    let _task = null; //current selected task


    let _domBackground = null;
    let _elmTopBar = null;
    let _dom = null;
    let _elmDeadline = null;
    let _elmTitle = null;
    let _elmDesicription = null;
    let _elmCreatedBy = null;
    let _elmAssignedTo = null;
    let _elmWorkflowStatus = null;
    let _elmMaxTime = null;
    let _elmEditButton = null;
    let _users = null;

    //Input Felder
    let _inputName = document.createElement("INPUT");
    let _inputSelect = document.createElement("select");






    function init() {
        _dom = document.getElementById(opts.id);

        _elmTitle = _dom.querySelector('.nameTask');
        _elmTitle.appendChild(_inputName);

        _elmAssignedTo = _dom.querySelector('.assigned-to');
        _inputSelect.setAttribute("id", "mySelect");

        _elmAssignedTo.appendChild(_inputSelect);

        _elmDesicription = _dom.querySelector('.textTask');
        _elmCreatedBy = _dom.querySelector('.created-by');


        _users = document.querySelectorAll('.menu-list .user');


        _elmMaxTime = _dom.querySelector('.maxTime');
        _elmDeadline = _dom.querySelector('.deadline');
        // _elmWorkflowStatus = _dom.querySelector('.workflow-Status');
        _elmEditButton = _dom.querySelector('.addTaskButton');


        _elmEditButton.addEventListener('click', () => {
            self.editMode(!_editMode);

            if (_editMode === true) {
                _elmEditButton.innerText = 'Save Task';
            } else {
                _elmEditButton.innerText = 'Edit Task';
            }

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

        let xhr = new XMLHttpRequest();
        //handle request finished
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {



                let jsonData = JSON.parse(xhr.response);
                _task = jsonData.task;

                if (_task) {
                    //to show a TaskForm
                    document.getElementById("taskName").parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling.nextSibling.style.display = "block";
                }
                let deadline = _task.deadline.split("T");

                // the name of the Task
                _inputName.setAttribute("value", _task.name);
                _inputName.readOnly = true;

                if (!_inputSelect.length) {
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
                }
                _inputSelect.selectedIndex = _task.assignedTo.id - 1;

                _inputSelect.disabled = true;

                //_elmTitle.value = task.name;
                _elmCreatedBy.value = "Created By " + _task.creator.displayName;
                _elmAssignedTo.value = "Assigned To " + _task.assignedTo.displayName;
                _elmMaxTime.value = "Maximum Time: " + _task.maximumWorkTime;
                _elmDeadline.value = "Deadline: " + deadline[0];
                _elmDesicription.innerHTML = _task.text;

                /*let textarea = document.createElement("textarea");
                textarea.style.width = '100%';
                textarea.style.height = "100%";
                textarea.innerHTML = _task.text;
                _elmDesicription.appendChild(textarea);
                createScEditor(textarea);
                let instance = sceditor.instance(textarea);
                _elmDesicription.innerHTML = textarea.fromBBCode(textarea.val());
                _elmDesicription.waTXT = null;*/

                //console.log(test[1]);

                //_elmWorkflowStatus.innerText = task.workflow.name;

                //_elmDesicription.value = task.text;

                //_dom.setAttribute('data-open', '1');
                //_shown = true;

            } else {
                // ToDo 
                console.log('request failed');
            }
        };

        let url = '/api/tasks/' + taskId;

        xhr.open('GET', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();

    };

    /*
        self.hide = function(task) {
            _dom.setAttribute('data-open', '0');
            _shown = false;
        }


    */

    self.editMode = function(editMode) {

        if (editMode === true && _editMode === false) {

            _editMode = true;
            _inputName.readOnly = false;
            _inputSelect.disabled = false;


            let textarea = document.createElement("textarea");
            textarea.style.width = '100%';
            textarea.style.height = "100%";
            textarea.innerHTML = _task.text;
            _elmDesicription.innerHTML = '';
            _elmDesicription.appendChild(textarea);

            createScEditor(textarea);
            _elmDesicription.waTXT = textarea;

        } else if (_editMode === true) {

            _editMode = false;
            _task.name = _inputName.value;
            _task.assignedToId = _inputSelect.value;
            console.log(_inputSelect.value);
            let instance = sceditor.instance(_elmDesicription.waTXT);
            _task.text = instance.val();
            _elmDesicription.innerHTML = instance.fromBBCode(instance.val());
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

    // start init
    init();


}