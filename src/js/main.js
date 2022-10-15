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
    let mdText = mdToHtmlElement(currentTask);
    div.innerHTML(sanitizeHTML(mdText));
    const fm = document.getElementById('task-project');
    let project = findProject(window.tasks[i].project_id, projects);
    fm.innerHTML(sanitizeHTML(project));
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
// Since it is fairly basic, the function is implemented rather than attaching a whole library

let testStr = "This is **important** and *italic*";

// var md = require('markdown-it')();
// var result = md.renderInline(testStr);

// var md = require('markdown-it')();
// var result = md.render(testStr);

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
var sanitizeHTML = function (str) {
    var temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

// function mdToHtmlElement(str) {
//     let span = document.createElement("span");
//     let taskObj = {};
//     let text = str;
//     const regBI = new RegExp("([\*_]{3}(?:.*?)[\*_]{3})", "g")
//     const regB = new RegExp("([\*_]{2}(?:.*?)[\*_]{2})", "g")
//     const regI = new RegExp("([\*_](?:.*?)[\*_])", "g")
//     const regLink = new RegExp("\[(.*)\]\(.*\)", "g");
//     const regArr = [regBI, regB, regI]
//     const includeArr = [3, 2, 1]
//     const nameArr = ["bold-italic", "bold", "italic"]
//     let i = 0;
//     regArr.forEach(regex => {
//         let textArr = text.split(regex);
//         textArr.forEach(element => {
//             let e = element;
//             let asterisks = "*".repeat(includeArr[i]);
//             let underscores = "_".repeat(includeArr[i]);
//             console.log(asterisks)
//             if (e.includes(asterisks) || e.includes(underscores)) {
//                 e = e.replaceAll(asterisks);
//                 e = e.replaceAll(underscores);
//                 taskObj[e] = nameArr[i];
//             } else if (e != "") {
//                 taskObj[e] = "normal";
//             }
//         });
//         i++
//     });

    // console.log(otherT)

    // // Example for bold
    // let otherT = text.split(regB);
    // otherT.forEach(element => {
    //     let e = element.trim();
    //     if (e[0] == "*") {
    //         taskObj[e.slic(2, -2)] = "bold";
    //     } else if (e != "") {
    //         taskObj[e] = "normal";
    //     }
    // });

//     return taskObj;
// }