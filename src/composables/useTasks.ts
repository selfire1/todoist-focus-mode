import type { Task } from "~/types";

export const useTasks = () => {
  // ?sort=[due|proj|prio]:[asc|desc]
  const gtm = useGtm(); // auto-imported by the module

  function customSort(tasksArr, queryStr) {
    // No sort is set
    if (!queryStr) {
      return tasksArr;
    }

    gtm?.trackEvent({
      event: "sort_triggered",
      category: "composable",
      action: "function",
      label: "sort set in query string",
      value: queryStr,
    });

    let tasks = tasksArr;
    // Split sort parameters by ","
    const queryArr = queryStr.split(",");
    // Construct an object based on the query
    let queryObj = {};
    queryArr.forEach((element) => {
      const key = element.split(":")[0];
      const value = element.split(":")[1];
      queryObj[key] = value;
    });
    // return queryObj;
    tasks = tasks.sort((a, b) => {
      for (const parameter in queryObj) {
        if (Object.hasOwnProperty.call(queryObj, parameter)) {
          let asc;
          // Check if query is ascending or descending
          queryObj[parameter] == "asc" ? (asc = true) : (asc = false);
          let compA;
          let compB;
          switch (parameter) {
            case "prio":
              compA = a.priority;
              compB = b.priority;
              if (!asc) {
                // Reverse the order on a descending call
                if (compA < compB) {
                  return 1;
                }
                if (compA > compB) {
                  return -1;
                }
                return 0;
              }
              if (compA < compB) {
                return -1;
              }
              if (compA > compB) {
                return 1;
              }
              return 0;
            case "proj":
              compA = a.project_id;
              compB = b.project_id;
              break;

            case "due":
              return sortByDue(a, b, { asc });

            case "alph":
              compA = a.content;
              compB = b.content;
              break;
            default:
              break;
          }
          if (!asc) {
            if (compA < compB) {
              return 1;
            }
            if (compA > compB) {
              return -1;
            }
            return 0;
          }
          if (compA < compB) {
            return -1;
          }
          if (compA > compB) {
            return 1;
          }
          return 0;
        }
      }
    });
    return tasks;
  }

  function sortByDue(a: Task, b: Task, opts: { asc: Boolean }) {
    const { asc } = opts;

    // nulls sort after anything else
    if (a.due === null) {
      return 1;
    }
    if (b.due === null) {
      return -1;
    }

    const compA = new Date(a.due.datetime).valueOf();
    const compB = new Date(b.due.datetime).valueOf();

    if (!asc) {
      return compB - compA;
    }
    return compA - compB;
  }
  return { customSort, sortByDue };
};
