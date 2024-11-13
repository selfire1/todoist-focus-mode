// https://github.com/Doist/todoist-api-typescript/blob/main/src/types/entities.ts

export type Task = {
  id: string;
  assigner_id: string | null;
  assignee_id: string | null;
  section_id: string | null;
  parent_id: string | null;
  order: number;
  content: string;
  description: string;
  project_id: string;
  is_completed: boolean;
  labels: string[];
  priority: number;
  comment_count: number;
  created_at: string;
  url: string;
  creator_id: string;
  duration: string | null;
  due: {
    date: string;
    string: string;
    lang: string;
    is_recurring: boolean;
    datetime: string;
  } | null;
};

export type Project = {
  id: string;
  name: string;
  color: string;
  commentCount: number;
  isShared: boolean;
  isFavorite: boolean;
  url: string;
  isInboxProject: boolean;
  isTeamInbox: boolean;
  order: number;
  viewStyle: string;
};
