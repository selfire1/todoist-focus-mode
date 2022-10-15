// Variables and page setup
const infoElement = document.getElementById('token');
const token = infoElement.value;
const params = JSON.parse(infoElement.dataset.params);
const projects = JSON.parse(infoElement.dataset.projects);
let filterQuery = params.filter;
window.tasks = JSON.parse(infoElement.dataset.tasks);
window.index = 0;
renderTask()
console.log(projects);
console.log(window.tasks);

// Rendering Tasks Function
function renderTask(i = window.index) {
    const div = document.getElementById('task-current');
    if (!window.tasks[i]) {
        div.innerText = "No tasks in this filter at the moment."
        return
    }
    const currentTask = window.tasks[i].content;
    div.innerHTML = mdToHtmlElement(currentTask);

    const fm = document.getElementById('task-project');
    fm.innerHTML = findProject(window.tasks[i].project_id, projects);
}
// Buttons
const btnNext = document.getElementById('btn-next');
btnNext.addEventListener('click', function () { btnCounter(window.tasks); })

const btnPrev = document.getElementById('btn-prev');
btnPrev.addEventListener('click', function () { btnCounter(window.tasks, false); })

const btnDone = document.getElementById('btn-done');
btnDone.addEventListener('click', function () {
    taskDone(window.tasks[window.index].id, token);
    notify("☑ Marked task as done")
})
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
// Keypress navigation
document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 229:
            break;
        case 37:
            // Left -> Previous
            if (window.index <= 0) {
                break
            }
            btnCounter(window.tasks, false)
            const btnPrev = document.getElementById('btn-prev');
            btnPrev.classList.add('hover');
            setTimeout(() => { btnPrev.classList.remove('hover') }, 100)
            break;
        case 39:
            // Right -> Next
            if (window.index >= window.tasks.length - 1) {
                break;
            }
            btnCounter(window.tasks)
            const btnNext = document.getElementById('btn-next');
            btnNext.classList.add('hover');
            setTimeout(() => { btnNext.classList.remove('hover') }, 100)
            break;
    }
};


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
// Action buttons
const btnCopy = document.getElementById('btn-copy-url');
btnCopy.addEventListener('click', function () {
    let url = document.location.href;
    navigator.clipboard.writeText(url).then(function () {
        console.log('Copied!');
        notify("📋 Copied link to clipboard");
    }, function () {
        notify("⚠️ Error! Please copy manually");
        console.log('Copy error');
    });

})

const btnUrl = document.getElementById('btn-open-td');
btnUrl.addEventListener('click', function () {
    const isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));
    if (isMobile) {
        // On mobile, open into the app
        let url = "todoist://task?id=" + window.tasks[window.index].id;
        window.open(url, "todoist tab")
    } else {
        window.open(window.tasks[window.index].url, "todoist tab")
    }
})
function notify(str) {
    const notifyBanner = document.getElementById('notify');
    notifyBanner.innerText = str;
    unfade(notifyBanner);
    setTimeout(() => {
        fade(notifyBanner);
    }, 3000)

}

// Fade out element
function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}
// Fade in element
function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.15;
    }, 10);
}
// Parse Todoist's Markdown
function mdToHtmlElement(str) {
    var md = window.markdownit({
        typographer: true
    });
    var result = md.render(str);
    return result;
}

function findProject(tasksProjectID, projects) {
    const isProjectId = (element) => element.id == tasksProjectID;
    const projectIndex = projects.findIndex(isProjectId)
    return projects[projectIndex].name;
}

/*!
 * Sanitize and encode all HTML in a user-submitted string
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {String} str  The user-submitted string
 * @return {String} str  The sanitized string
 */
function sanitizeHTML(str) {
    var temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};