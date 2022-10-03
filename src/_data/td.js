// import { TodoistApi } from "@doist/todoist-api-typescript"
const { TodoistApi } = require("@doist/todoist-api-typescript")

function projects() {
    const api = new TodoistApi("eed6c283388e7038ab617c946eb3a9da51888228")
    let projectDump;
    api.getProjects()
        .then((projects) => projectDump = projects)
        .catch((error) => projectDump = error)

    return projectDump;
}
function test() {
    return "Test"
}
module.exports = projects();