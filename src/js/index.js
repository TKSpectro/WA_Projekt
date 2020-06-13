//default chat is all
let textarea = document.getElementById('message');
let currentUserElm = document.getElementById('btn-chat-all');
let messagesElm = document.getElementById('messages');

function loadMessages(elm, fromId) {
    let xhr = new XMLHttpRequest();

    //handle request finished
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            let jsonData = JSON.parse(xhr.response);

            //map messages into socket messages format
            //and write to the button
            if (elm.lastMessages instanceof Array === false) {
                elm.lastMessages = [];
            }

            //append on top
            for (let index = 0; index < jsonData.messages; ++index) {
                const message = jsonData.messages[index];
                elm.lastMessages.unshift({
                    text: message.text,
                    from: {
                        id: message.from.id,
                        displayName: message.from.firstName + ' ' + message.from.lastName,
                    },
                    to: message.to
                });
            }

            userPressed(elm);
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
    elm.innerText = elm.getAttribute('data-fullname');

    if (elm.getAttribute('data-new') !== '0') {
        elm.innerText += ' (' + elm.getAttribute('data-new') + ')';
    }
}

function userPressed(elm) {
    currentUserElm = elm;

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

function sendPressed(elm) {
    let textarea = document.getElementById('message');
    let data = {
        text: textarea.value,
    };

    textarea.value = '';

    if (currentUserElm.getAttribute('data-id') !== '0') {
        data.toId = parseInt(currentUserElm.getAttribute('data-id'));
    }

    io.emit('message', data);
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
        elm.innerText = data.from.displayName + ': ' + data.text;
        messageElm.appendChild(elm);
        messageElm.scrollTop = messageElm.scrollHeight;
    }
}

io.on('message', (data) => {
    handleIncomingMessage(data);
});

messagesElm.addEventListener('scroll', function () {
    if (this.scrollTop === 0) {
        let fromId = currentUserElm.getAttribute('data-id');
        loadMessages(currentUserElm, fromId === '0' ? null : fromId);
    }
});

textarea.altActive = false;
textarea.addEventListener('keydown', function (event) {
    if (event.keyCode === 18) {
        textarea.altActive = true;
    }
});

textarea.addEventListener('keyup', function (event) {
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