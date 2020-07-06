//default chat is all
let textarea = document.getElementById('message');
let currentUserElm = document.getElementById('btn-chat-all');
let messagesElm = document.getElementById('messages');

//!str will return true if the string is null, undefined, or ''
//!str.trim() will return true if the string is '' after removing trailing whitespaces (which means it is an empty string)
function isNullOrEmpty(str) {
    return !str || !str.trim();
}

function loadMessages(elm, fromId) {
    let xhr = new XMLHttpRequest();

    //handle request finished
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            let jsonData = JSON.parse(xhr.response);

            //map messages into socket messages format
            //and write to the button
            if (elm.lastMessages instanceof Array === false) {
                elm.lastMessages = [];
            }

            //append on top
            for (let index = 0; index < jsonData.messages.length; ++index) {
                const message = jsonData.messages[index];
                elm.lastMessages.unshift({
                    text: message.text,
                    from: {
                        id: message.from.id,
                        displayName: message.from.firstName.charAt(0) + message.from.lastName.charAt(0),
                    },
                    to: message.to
                });
            }

            // userPressed(elm);
        } else {
            console.log('request failed');
        }
    };

    let url = messagesElm.getAttribute('data-action');

    if (fromId) {
        url += '?fromId=' + fromId;
    }

    if (elm.lastMessages instanceof Array === true) {
        if (url.indexOf('?') === -1) {
            url += '?';
        } else {
            url += '&';
        }

        url += 'offset=' + elm.lastMessages.length;
    }

    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
}

function updateUserBtnName(elm) {
    //update user name if there is incoming message icon
    elm.innerText = elm.getAttribute('data-shortname');

    if (elm.getAttribute('data-new') !== '0') {
        elm.innerText += ' (' + elm.getAttribute('data-new') + ')';
    }
}

function userPressed(elm) {
    currentUserElm = elm;
    document.getElementById("btn-chat-all").parentNode.parentNode.parentNode.parentNode.className = "wrapper chat-open";

    if (elm.getAttribute('data-fullname') !== null) {
        document.getElementById("chatTitle").innerHTML = elm.getAttribute('data-fullname');
    } else {
        document.getElementById("chatTitle").innerHTML = "All";

    }
    elm.setAttribute('data-new', '0');
    updateUserBtnName(elm);

    //clean current messages in pot
    let messagesElm = document.getElementById('messages');
    messagesElm.innerHTML = '';

    //retrieve messages for user if not done yet
    if (!elm.lastMessages) {
        let fromId = elm.getAttribute('data-id');
        loadMessages(elm, fromId === '0' ? null : fromId);
    }
    //otherwise the socket already append the messages so display
    else {
        for (let index = 0; index < elm.lastMessages.length; ++index) {
            const msg = elm.lastMessages[index];
            handleIncomingMessage(msg);
        }
    }
}

function chatClose() {
    document.getElementById("btn-chat-all").parentNode.parentNode.parentNode.parentNode.className = "wrapper";

}


function sendPressed(elm) {
    let textarea = document.getElementById('message');
    let data = {
        text: textarea.value,
    };

    textarea.value = '';

    if (!isNullOrEmpty(data.text)) {
        if (currentUserElm.getAttribute('data-id') !== '0') {
            data.toId = parseInt(currentUserElm.getAttribute('data-id'));
        }

        io.emit('message', data);
    } else {
        textarea.placeholder = 'String is empty';
        console.log('String is empty or contains only spaces');
    }
}

function handleIncomingMessage(data) {
    let messageElm = document.getElementById('messages');
    let elmId = null;

    //check incoming message has data.to === null or not inside, means public chat
    if (!data.to) {
        if (currentUserElm.getAttribute('data-id') !== '0') {
            elmId = 'all';
        }
    } else if (currentUserId !== data.from.id && currentUserElm.getAttribute('data-id') != data.from.id) {
        elmId = data.from.id;
    }

    if (elmId !== null) {
        let elm = document.getElementById('btn-chat-' + elmId);
        if (elm) {
            let newMessageCount = parseInt(elm.getAttribute('data-new')) + 1;
            elm.setAttribute('data-new', newMessageCount);
            if (elm.lastMessages) {
                elm.lastMessages.push(data);
            }
            updateUserBtnName(elm);
        }
    } else {
        let elm = document.createElement('DIV');
        elm.className = "singleMessage";

        elm.innerText = data.from.displayName + ': ' + data.text;
        messageElm.appendChild(elm);
        messageElm.scrollTop = messageElm.scrollHeight;
    }
}

io.on('message', (data) => {
    console.log('incoming message');
    handleIncomingMessage(data);
});

messagesElm.addEventListener('scroll', function() {
    if (this.scrollTop === 0) {
        let fromId = currentUserElm.getAttribute('data-id');
        loadMessages(currentUserElm, fromId === '0' ? null : fromId);
    }
});

textarea.altActive = false;
textarea.addEventListener('keydown', function(event) {
    if (event.keyCode === 18) {
        textarea.altActive = true;
    }
});

textarea.addEventListener('keyup', function(event) {
    if (event.keyCode === 18) {
        textarea.altActive = false;
    }
    if (event.keyCode === 13 && textarea.altActive === false) {
        sendPressed();
    } else if (event.keyCode === 13 && textarea.altActive === true) {
        textarea.value += '\n';
    }
});

//initial load
loadMessages(currentUserElm);

//Drag and Drop for Kanban -> HTML5Sortable
let sortableLists = sortable('.tasks', {
    forcePlaceholderSize: true,
    placeholderClass: 'task-placeholder',
    acceptFrom: '.tasks',
    hoverClass: 'dragging',
});

for (let index = 0; index < sortableLists.length; index++) {
    const list = sortableLists[index];
    list.addEventListener('sortstart', function(e) {
        // do nothing
    });

    list.addEventListener('sortstop', function(e) {
        //console.log('sortstop', e);
        //do nothing
    });

    list.addEventListener('sortupdate', function(e) {
        let item = e.detail.item;
        let target = e.target;

        let line = item.querySelector('.line');

        if (line) {
            line.style.background = target.getAttribute('data-workflow-color');
        }

        io.emit('task/move', {
            id: item.getAttribute('data-id'),
            workflowId: target.getAttribute('data-workflow-id'),
            sort: Array.prototype.indexOf.call(item.parentNode.children, item)
        });
    });
}

io.on('task/move', (data) => {
    let item = document.querySelector('.task[data-id="' + data.id + '"]');
    if (item) {
        let taskList = document.querySelector('.tasks[data-workflow-id="' + data.workflowId + '"]');
        if (taskList) {
            let index = data.sort;
            if (taskList.children.length <= index + 1) {
                taskList.appendChild(item);
            } else {
                let currentIndex = Array.prototype.indexOf.call(taskList.children, item);

                if (index !== 0 && currentIndex !== -1 && index >= currentIndex) {
                    index = index + 1;
                }

                let sibling = taskList.children[index];
                taskList.insertBefore(item, sibling);

                let line = item.querySelector('.line');

                if (line) {
                    line.style.background = taskList.getAttribute('data-workflow-color');
                }
            }
        }
    }
});

function addPressed(elm) {
    //elm.className = 'active';

    var form = document.getElementById('taskForm');
    let currentUserId = document.getElementById('currentUserId').value;
    console.log("done");

    var xhr = new XMLHttpRequest();
    xhr.open(form.getAttribute('method') || 'POST', form.getAttribute('action'));
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        task: {
            name: document.getElementById('nameTask').value,
            text: document.getElementById('textTask').value,
            creatorId = currentUserId,
            maximumWorkTime: document.getElementById('maxTime').value,
            deadline: document.getElementById('deadline').value,
            assignedToId: document.getElementById('assignedToId').value,
            projectId: document.getElementById('projectID').value,
            workflowId: document.getElementById('workflowId').value,
        }
    }));
}