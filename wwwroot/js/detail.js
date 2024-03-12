let worker = undefined;

function obsoleteHover(obj, event) {
    let hover_msg = obj.children[1];
    let hover_msg_width = hover_msg.offsetWidth;

    let posX, posY;
    posX = event.pageX + 8;
    posY = event.pageY + 14;

    let right_bound = posX + hover_msg_width + 2;

    if (right_bound > (window.innerWidth || document.documentElement.clientWidth)) { // out of bound
        posX = event.pageX - hover_msg_width;
    }

    hover_msg.style.left = posX + 'px';
    hover_msg.style.top = posY + 'px';
}

function startTimerWorker(workerPath, expire) {
    // this function is guarantee to be called when the post is still active
    // update to current first
    updateFlip(expire - new Date().getTime(), true);
    console.log("Webworker started succesfully!");

    if (typeof(worker) === "undefined") {
        worker = new Worker(workerPath);
    }

    worker.onmessage = function (message) {
        console.log("Worker received the current time!")
        let currentTime = parseInt(message.data);
        if (expire < currentTime) { // if the expire time is met
            worker.terminate();
            worker = undefined;
            location.reload(); // when reload, the post state must enter closed so the webworker will never start again
        }
        else {
            if (expire >= currentTime) {
                let timeDiff = expire - currentTime;
                updateFlip(timeDiff); // update flip timer
            }
        }
    };
}