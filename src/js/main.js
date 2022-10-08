// Variables and page setup
const token = document.getElementById('token').value;
window.tasks = JSON.parse(document.getElementById('token').dataset.tasks);
window.index = 0;
renderTask()
console.log(window.tasks)

// Rendering Tasks Function
function renderTask(i = window.index) {
    const div = document.getElementById('task-container');
    const currentTask = window.tasks[i].content;
    div.innerText = currentTask;
}
// Buttons
const btnNext = document.getElementById('btn-next');
btnNext.addEventListener('click', function () { btnCounter(window.tasks); })

const btnPrev = document.getElementById('btn-prev');
btnPrev.addEventListener('click', function () { btnCounter(window.tasks, false); })

const btnDone = document.getElementById('btn-done');
btnDone.addEventListener('click', function () {
    taskDone(window.tasks[window.index].id, token);
})

// Button Counter
function btnCounter(tasks, increase = true) {
    if (increase) {
        window.index++
    } else {
        window.index--
    }
    renderTask();
    if (window.index <= 0) {
        btnPrev.disabled = true;
    } else {
        btnPrev.disabled = false;
    }
    if (window.index >= tasks.length - 1) {
        btnNext.disabled = true;
    } else {
        btnNext.disabled = false;
    }
}

// Closing a task
async function taskDone(taskId, apiKey) {
    let url = `https://api.todoist.com/rest/v2/tasks/${taskId}/close`;
    let response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    })
    if (response.ok) {
        console.log("Completed task");
        window.tasks.splice(window.index, 1)
        window.index--
        renderTask()
    } else {
        alert("HTTP-Error: " + response.status);
    }
}
// ---------------------
async function auth(apiKey) {
    let url = "https://api.todoist.com/rest/v2/tasks";
    let response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    });

    if (response.ok) { // if HTTP-status is 200-299
        // get the response body (the method explained below)
        let taskList = await response.json();
        console.log(taskList)
        let firstTask = taskList[0].content
        const body = document.body;
        const div = document.createElement('div')
        div
            .classList
            .add("task-container")
        body.append(div)
        div.innerText = firstTask
        console.log("Done!")
    } else {
        alert("HTTP-Error: " + response.status);
    }
}
;