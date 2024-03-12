let message = undefined;

function updateTime() {
    let cur_time = new Date().getTime();
    self.postMessage(cur_time);
}

updateTime();
setInterval(updateTime, 1000);