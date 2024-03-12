function postBackgroundTasks(print) {
    var xhr1 = new XMLHttpRequest();
    xhr1.open('POST', '/post/BackgroundTasks', true);
    xhr1.setRequestHeader('Content-Type', 'application/json');
    xhr1.onreadystatechange = function () {
        if (xhr1.readyState === 4) {
            if (xhr1.status >= 200 && xhr1.status < 300) {
                console.log(print);
            }
            else {
                console.error(xhr1.responseText);
            }
        };
    };
    xhr1.send(print);
};

function notiBackgroundTasks() {
    var xhr2 = new XMLHttpRequest();
    xhr2.open('POST', '/notification/CheckUnread', true);
    xhr2.setRequestHeader('Content-Type', 'application/json');
    xhr2.onreadystatechange = function () {
        if (xhr2.readyState === 4) {
            if (xhr2.status >= 200 && xhr2.status < 300) {
                var notiBtn = document.getElementById("notiBtn");
                var redDotAppended = document.querySelector(".btnBadge") != null;
                var data = JSON.parse(xhr2.responseText);
                if (data.unread && !redDotAppended) {
                    var redDot = document.createElement('span');
                    redDot.className = 'btnBadge';
                    redDot.setAttribute('b-zz1b99kxi4', '');
                    notiBtn.appendChild(redDot);
                }
                else if (!data.unread && redDotAppended) {
                    var redDot = document.querySelector(".btnBadge[b-zz1b99kxi4]");
                    if (redDot) {
                        redDot.remove();
                    }
                }
            }
            else {
                console.error(xhr2.responseText);
            }
        }
    };
    xhr2.send();
};

function filterPost(serverpage) {
    var xhr3 = new XMLHttpRequest();
    xhr3.open('GET', serverpage, true);

    xhr3.onreadystatechange = function () {
        if (xhr3.readyState === 4) {
            var tbody = document.getElementById('index-tbody');
            if (xhr3.status >= 200 && xhr3.status < 300) {
                tbody.innerHTML = xhr3.responseText;
            }
            else {
                console.error(xhr1.responseText);
            }
        };
    };
    xhr3.send();
}

document.addEventListener('DOMContentLoaded', function () {
    var firstRun = sessionStorage.getItem('postBackgroundTasks');

    if (!firstRun) {
        postBackgroundTasks("Init");
        sessionStorage.setItem('postBackgroundTasks', true);
    }

    var now = new Date();
    var secUntilNextMin = 60 - now.getSeconds();

    notiBackgroundTasks();
    setTimeout(function () {
        postBackgroundTasks("Count");
        notiBackgroundTasks();
        setInterval(function () {
            postBackgroundTasks("Count");
            notiBackgroundTasks();
        }, 60000);
    }, secUntilNextMin * 1000);
}); 