function runBackgroundTasks(print) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/post/BackgroundTasks', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log(print);
            } else {
                console.error(xhr.responseText);
            }
        }
    };
    xhr.send();
}

document.addEventListener('DOMContentLoaded', function () {
    var alreadyScheduled = sessionStorage.getItem('backgroundTasksScheduled');

    if (!alreadyScheduled) {
        runBackgroundTasks("Init");
        sessionStorage.setItem('backgroundTasksScheduled', true);
    }
    setInterval(function () {
        runBackgroundTasks("Count");
    }, 5000);
});