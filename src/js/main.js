const token = document.getElementById('token').value;
const tasks = JSON.parse(document.getElementById('token').dataset.tasks);
window.index = 21;
renderTask(window.index)
console.log(tasks.length)
function renderTask(i) {
    const div = document.getElementById('task-container');
    const currentTask = tasks[i].content;
    console.log(currentTask);
    div.innerText = tasks[i].content;
}
const btnNext = document.getElementById('btn-next');
btnNext.addEventListener('click', function () {
    btnCounter(tasks);
})

const btnPrev = document.getElementById('btn-prev');
btnPrev.addEventListener('click', function () {
    btnCounter(tasks, false);
})

function btnCounter(tasks, increase = true) {
    if (increase) {
        window.index++
    } else {
        window.index--
    }
    console.log(window.index);
    renderTask(window.index);
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