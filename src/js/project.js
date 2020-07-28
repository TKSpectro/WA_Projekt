function projectPressed(elm) {
    let projectId = elm.getAttribute('data-id');

    const url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/?projectId=' + projectId;

    window.location.href = url;
}