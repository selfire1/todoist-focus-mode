/* eslint-disable indent */
/* eslint-disable no-use-before-define */
// Variables and page setup
const infoElement = document.getElementById('token');
const token = infoElement.value;
const projects = JSON.parse(infoElement.dataset.projects);
window.tasks = JSON.parse(infoElement.dataset.tasks);
window.index = 0;
renderTask();
console.log(projects);
console.log(window.tasks);

// Rendering Tasks Function
function renderTask(i = window.index) {
    const div = document.getElementById('task-current');
    if (!window.tasks[i]) {
        div.innerText = 'No tasks in this filter at the moment.';
        return;
    }
    const currentTask = window.tasks[i].content;
    div.innerHTML = mdToHtmlElement(currentTask);

    const fm = document.getElementById('task-project');
    const project = findProject(window.tasks[i].project_id, projects);
    fm.innerHTML = sanitizeHTML(project);
}
// Buttons
const btnNext = document.getElementById('btn-next');
btnNext.addEventListener('click', () => { btnCounter(window.tasks); });

const btnPrev = document.getElementById('btn-prev');
btnPrev.addEventListener('click', () => { btnCounter(window.tasks, false); });

const btnDone = document.getElementById('btn-done');
btnDone.addEventListener('click', () => {
    taskDone(window.tasks[window.index].id, token);
    notify('☑ Marked task as done');
});
// Closing a task
async function taskDone(taskId, apiKey) {
    const url = `https://api.todoist.com/rest/v2/tasks/${taskId}/close`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
    });
    if (response.ok) {
        console.log('Completed task');
        window.tasks.splice(window.index, 1);
        window.index -= 1;
        renderTask();
    } else {
        alert(`HTTP-Error: ${response.status}`);
    }
}
// Keypress navigation
document.onkeydown = function keyMove(e) {
    switch (e.keyCode) {
        case 229:
            break;
        case 37:
            // Left -> Previous
            if (window.index <= 0) {
                break;
            }
            btnCounter(window.tasks, false);
            btnPrev.classList.add('hover');
            setTimeout(() => { btnPrev.classList.remove('hover'); }, 100);
            break;
        case 39:
            // Right -> Next
            if (window.index >= window.tasks.length - 1) {
                break;
            }
            btnCounter(window.tasks);
            btnNext.classList.add('hover');
            setTimeout(() => { btnNext.classList.remove('hover'); }, 100);
            break;
        default:
            break;
    }
};

// Button Counter
function btnCounter(tasks, increase = true) {
    if (increase) {
        window.index += 1;
    } else {
        window.index -= 1;
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
btnCopy.addEventListener('click', () => {
    const url = document.location.href;
    navigator.clipboard.writeText(url).then(() => {
        console.log('Copied!');
        notify('📋 Copied link to clipboard');
    }, () => {
        notify('⚠️ Error! Please copy manually');
        console.log('Copy error');
    });
});

const btnUrl = document.getElementById('btn-open-td');
btnUrl.addEventListener('click', () => {
    const isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));
    if (isMobile) {
        // On mobile, open into the app
        const url = `todoist://task?id=${window.tasks[window.index].id}`;
        window.open(url, 'todoist tab');
    } else {
        window.open(window.tasks[window.index].url, 'todoist tab');
    }
});
function notify(str) {
    const notifyBanner = document.getElementById('notify');
    notifyBanner.innerText = str;
    unfade(notifyBanner);
    setTimeout(() => {
        fade(notifyBanner);
    }, 3000);
}

// Fade out element
function fade(element) {
    let op = 1; // initial opacity
    const timer = setInterval(() => {
        const el = element;
        if (op <= 0.1) {
            clearInterval(timer);
            el.style.display = 'none';
        }
        el.style.opacity = op;
        el.style.filter = `alpha(opacity=${op * 100})`;
        op -= op * 0.1;
    }, 50);
}
// Fade in element
function unfade(element) {
    let op = 0.1; // initial opacity
    const el = element;
    el.style.display = 'block';
    const timer = setInterval(() => {
        if (op >= 1) {
            clearInterval(timer);
        }
        el.style.opacity = op;
        el.style.filter = `alpha(opacity=${op * 100})`;
        op += op * 0.15;
    }, 10);
}
// Parse Todoist's Markdown
function mdToHtmlElement(str) {
    const md = window.markdownit({
        typographer: true,
    });
    const result = md.render(str);
    return result;
}

function findProject(tasksProjectID, projectName) {
    const isProjectId = (element) => element.id === tasksProjectID;
    const projectIndex = projectName.findIndex(isProjectId);
    return projects[projectIndex].name;
}

/*!
 * Sanitize and encode all HTML in a user-submitted string
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {String} str  The user-submitted string
 * @return {String} str  The sanitized string
 */
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}
