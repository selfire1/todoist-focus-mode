import { TodoistApi } from "./TodoistApi.js";
export default function logData() {
    const api = new TodoistApi("eed6c283388e7038ab617c946eb3a9da51888228")

    api.getProjects()
        .then((projects) => console.log(projects))
        .catch((error) => console.log(error))
}

export function hi() {
    console.log("hi from the module")
}
