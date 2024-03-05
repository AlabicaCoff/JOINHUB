function runBackgroundTasks() {
    $.ajax({
        url: '@Url.Action("BackgroundTasks", "Post")',
        type: 'POST',
        success: function (data) {
            console.log(data.status);
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
        }
    });
}

$(document).ready(function () {
    runBackgroundTasks();
    setInterval(runBackgroundTasks, 60000);
});