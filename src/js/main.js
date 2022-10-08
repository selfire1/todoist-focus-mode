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

// Filters 2.0
var params = JSON.parse(document.getElementById('token').dataset.params);
if (params.hasOwnProperty("filter")) {
    let filter = params.filter;
    // console.log(filteredTasks(filter, token));
    filteredTasks(filter, token).then(response => console.log(response));
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
// Get filtered tasks
async function filteredTasks(filter, apiKey) {
    let url = "https://api.todoist.com/rest/v2/tasks"
    url += `?filter=${encodeURIComponent(filter)}`
    let response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    })
    if (response.ok) {
        let json = await response.json();
        return json;
    } else {
        alert("HTTP-Error: " + response.status)
    }
}

// --------------------
// Filter logic
// var params = JSON.parse(document.getElementById('token').dataset.params);
// for (const key in params) {
//     if (Object.hasOwnProperty.call(params, key)) {
//         params[key] = params[key].split(";")
//         for (let i = 0; i < params[key].length; i++) {
//             let keys = params[key][i].split(":")[0];
//             let value = params[key][i].split(":")[1];
//             params[key][keys] = value;
//             // delete this
//             for (const k in params[key]) {
//                 if (Object.hasOwnProperty.call(params[key], k)) {
//                     if (params[key][k].includes(",")) {
//                         params[key][k] = params[key][k].split(",")
//                     }
//                 }
//             }
//         }
//     }
// }
// console.log(params);


// for (let i = 0; i < params.length; i++) {
//     params[i] = paramObject(params[i]);
//     console.log(params[i])
// }
// let from = params.from;
// console.log(from.split(";"))
// console.log(paramObject(params.from))
// Param object
// function paramObject(parameters) {
//     let fromIds = {};
//     for (let i = 0; i < parameters.length; i++) {
//         let key = parameters[i].split(";")[0];
//         let value = parameters[i].split(":")[1];
//         value = value.split(',');
//         fromIds[key] = value;
//     }
//     return fromIds;
// }

// I haven't fully figured out how `.fetch` works, so I use the below function to attach the returned data to the global variable
function passOn(data) {
    window.projects = data;
    console.log(window.projects);
}

// Get Projects
async function getProjects(apiKey) {
    let url = "https://api.todoist.com/rest/v2/projects";
    let response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    })
        .then(response => response.json()).then(body => passOn(body));

    // if (response.ok) { // if HTTP-status is 200-299
    //     // get the response body (the method explained below)
    //     let projects = await response.json();
    //     return projects;
    // } else {
    //     alert("HTTP-Error: " + response.status);
    // }
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