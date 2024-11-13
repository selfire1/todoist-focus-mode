import { expect, test } from "vitest";
import type { Task } from "~/types";

const mockDateAndTimeTasks: Task[] = [
  {
    id: "8144733701",
    assigner_id: null,
    assignee_id: null,
    project_id: "664569129",
    section_id: null,
    parent_id: null,
    order: 21,
    content: "Today task",
    description: "",
    is_completed: false,
    labels: [],
    priority: 1,
    comment_count: 0,
    creator_id: "2493796",
    created_at: "2024-06-24T07:06:10.464617Z",
    due: {
      date: "2024-06-24",
      string: "24 Jun 12:00",
      lang: "en",
      is_recurring: false,
      datetime: "2024-06-24",
    },
    url: "https://todoist.com/app/task/8144733701",
    duration: null,
  },
  {
    id: "8144732813",
    assigner_id: null,
    assignee_id: null,
    project_id: "664569129",
    section_id: null,
    parent_id: null,
    order: 20,
    content: "Yesterday task",
    description: "",
    is_completed: false,
    labels: [],
    priority: 1,
    comment_count: 0,
    creator_id: "2493796",
    created_at: "2024-06-24T07:05:49.974896Z",
    due: {
      date: "2024-06-23",
      string: "24 Jun 08:00",
      lang: "en",
      is_recurring: false,
      datetime: "2024-06-23",
    },
    url: "https://todoist.com/app/task/8144732813",
    duration: null,
  },
  {
    id: "8144734009",
    assigner_id: null,
    assignee_id: null,
    project_id: "664569129",
    section_id: null,
    parent_id: null,
    order: 22,
    content: "Tomorrow task",
    description: "",
    is_completed: false,
    labels: [],
    priority: 1,
    comment_count: 0,
    creator_id: "2493796",
    created_at: "2024-06-24T07:06:18.799673Z",
    due: {
      date: "2024-06-25",
      string: "24 Jun 18:00",
      lang: "en",
      is_recurring: false,
      datetime: "2024-06-25",
    },
    url: "https://todoist.com/app/task/8144734009",
    duration: null,
  },
];

test("tasks with only date are sorted by ascending", () => {
  const { sortByDue } = useTasks();
  const sorted = mockDateAndTimeTasks.sort((a, b) =>
    sortByDue(a, b, { asc: true }),
  );
  const [first, second, third] = sorted;
  expect(first.content).toBe("Yesterday task");
  expect(second.content).toBe("Today task");
  expect(third.content).toBe("Tomorrow task");
});

test("tasks with only date are sorted by descending", () => {
  const { sortByDue } = useTasks();
  const sorted = mockDateAndTimeTasks.sort((a, b) =>
    sortByDue(a, b, { asc: false }),
  );
  const [first, second, third] = sorted;
  expect(first.content).toBe("Tomorrow task");
  expect(second.content).toBe("Today task");
  expect(third.content).toBe("Yesterday task");
});
