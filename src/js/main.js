// Variables and page setup
const token = document.getElementById('token').value;
window.tasks = JSON.parse(document.getElementById('token').dataset.tasks);
window.index = 0;
renderTask()
console.log(window.tasks)

// Rendering Tasks Function
function renderTask(i = window.index) {
    const div = document.getElementById('task-container');
    if (!window.tasks[i]) {
        div.innerText = "No tasks in this filter at the moment."
        return
    }
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
// Parse Todoist's Markdown
// Since it is fairly basic, the function is implemented rather than attaching a whole library

mdToHtml("**DO** this thing **important** and *italic*")
function mdToHtml(str) {
    let span = document.createElement("span");
    let text = str;
    const regBold = new RegExp("[\*_]{2}(.*)[\*_]{2}", "g");
    const regB = new RegExp("([\*_]{2}(?:.*?)[\*_]{2})", "g")
    const regItalic = new RegExp("[\*_](.*)[\*_]", "g");
    const regLink = new RegExp("\[(.*)\]\(.*\)", "g");

    let otherT = text.split(regB);
    console.log(otherT)

    // Example for bold
    let taskText = {};
    otherT.forEach(element => {
        let e = element.trim();
        if (e[0] == "*") {
            taskText[e.slic(2, -2)] = "bold";
        } else if (e != "") {
            taskText[e] = "normal";
        }
    });
    console.log(taskText);

    const matches = text.matchAll(regBold);
    for (const match of matches) {
        const cg1 = match[1];
        const cg2 = match[2];
    }

}