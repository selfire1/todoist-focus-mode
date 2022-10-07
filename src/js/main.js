// window.addEventListener('DOMContentLoaded', () => {
//     const token = document.getElementById('testing').dataset.token;
//     // document.getElementById("testing").addEventListener("click", showTasks());
//     console.log(token);
//     auth(token);
//     async function auth(apiKey) {
//         let url = "https://api.todoist.com/rest/v2/tasks";
//         let response = await fetch(url, {
//             headers: {
//                 Authorization: `Bearer ${apiKey}`
//             }
//         });

//         if (response.ok) { // if HTTP-status is 200-299
//             // get the response body (the method explained below)
//             let taskList = await response.json();
//             console.log(taskList)
//             let firstTask = taskList[0].content
//             const body = document.body;
//             const div = document.createElement('div')
//             div
//                 .classList
//                 .add("task-container")
//             body.append(div)
//             div.innerText = firstTask
//             console.log("Done!")
//         } else {
//             alert("HTTP-Error: " + response.status);
//         }
//     }
// });