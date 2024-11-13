import { todoistEventHandler } from "../../utils/todoist";
import { SECURE_PATH } from "~/constants";

export default todoistEventHandler({
  async onSuccess(event, { tokens }) {
    await setUserSession(event, { user: tokens });
    return sendRedirect(event, SECURE_PATH);
  },
});
