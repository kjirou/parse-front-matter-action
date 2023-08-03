const core = require("@actions/core");
const matter = require("gray-matter");

const content = core.getInput("content");

(async () => {
  const parsed = matter(content);
  core.setOutput("frontMatterAsJson", JSON.stringify(parsed.data));
  core.setOutput("body", parsed.content);
})();
