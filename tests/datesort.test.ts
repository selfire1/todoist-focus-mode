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
    content: "Noon task",
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
      datetime: "2024-06-24T12:00:00",
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
    content: "Morning task",
    description: "",
    is_completed: false,
    labels: [],
    priority: 1,
    comment_count: 0,
    creator_id: "2493796",
    created_at: "2024-06-24T07:05:49.974896Z",
    due: {
      date: "2024-06-24",
      string: "24 Jun 08:00",
      lang: "en",
      is_recurring: false,
      datetime: "2024-06-24T08:00:00",
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
    content: "Evening task",
    description: "",
    is_completed: false,
    labels: [],
    priority: 1,
    comment_count: 0,
    creator_id: "2493796",
    created_at: "2024-06-24T07:06:18.799673Z",
    due: {
      date: "2024-06-24",
      string: "24 Jun 18:00",
      lang: "en",
      is_recurring: false,
      datetime: "2024-06-24T18:00:00",
    },
    url: "https://todoist.com/app/task/8144734009",
    duration: null,
  },
];

test("tasks are sorted by date ascending", () => {
  const { sortByDue } = useTasks();
  const sorted = mockDateAndTimeTasks.sort((a, b) =>
    sortByDue(a, b, { asc: true }),
  );
  const [first, second, third] = sorted;
  expect(first.content).toBe("Morning task");
  expect(second.content).toBe("Noon task");
  expect(third.content).toBe("Evening task");
});

test("tasks are sorted by date descending", () => {
  const { sortByDue } = useTasks();
  const sorted = mockDateAndTimeTasks.sort((a, b) =>
    sortByDue(a, b, { asc: false }),
  );
  const [first, second, third] = sorted;
  expect(first.content).toBe("Evening task");
  expect(second.content).toBe("Noon task");
  expect(third.content).toBe("Morning task");
});
