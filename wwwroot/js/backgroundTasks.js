function runBackgroundTasks(print) {
    var xhr1 = new XMLHttpRequest();
    xhr1.open('POST', '/post/BackgroundTasks', true);
    xhr1.onreadystatechange = function () {
        if (xhr1.readyState === 4) {
            if (xhr1.status >= 200 && xhr1.status < 300) {
                console.log(print);
            } else {
                console.error(xhr1.responseText);
            }
        }
    };
    xhr1.send(print);

    var xhr2 = new XMLHttpRequest();
    xhr2.open('POST', '/notification/CheckUnread', true);
    xhr2.setRequestHeader('Content-Type', 'application/json');

    xhr2.onreadystatechange = function () {
        if (xhr2.readyState === 4)
        {
            if (xhr2.status >= 200 && xhr2.status < 300)
            {
                var notiBtn = document.getElementById("notiBtn");
                var redDotAppended = document.querySelector(".btnBadge") != null;
                var data = JSON.parse(xhr2.responseText);
                console.log(data.unread)
                if (data.unread && !redDotAppended)
                {
                    var redDot = document.createElement('span');
                    redDot.className = 'btnBadge';
                    redDot.setAttribute('b-zz1b99kxi4', '');
                    notiBtn.appendChild(redDot);
                }
                else if (!data.unread && redDotAppended)
                {
                    // Correctly remove the red dot if there are no unread notifications
                    var redDot = document.querySelector(".btnBadge[b-zz1b99kxi4]");
                    if (redDot)
                    {
                        redDot.remove();
                    }
                }
            }
            else
            {
                console.error(xhr2.responseText);
            }
        }
    };
    xhr2.send();
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