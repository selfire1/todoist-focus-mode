export const markdownify = (str: string) => {
  const markdownIt = require("markdown-it");
  const markdownItRenderer = new markdownIt();
  return markdownItRenderer.renderInline(str);
};
