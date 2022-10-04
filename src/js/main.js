
// const form = document.getElementById('api-form')
// console.log(form)
// form.addEventListener('submit', (event) => {
//     showFirstTask(document.getElementById('api-input').value);
// })
let key = document.currentScript.getAttribute('key');
showFirstTask(key);

function keyFromInput() {
    const input = document.getElementById('api-input');
    const apiKey = input.value;
    return apiKey;
}
async function showFirstTask(apiKey) {
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