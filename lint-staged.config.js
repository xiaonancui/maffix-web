const quote = (value) => `"${value}"`;

const buildPrettierCommand = (files) => {
  if (!files.length) return null;
  return `npm exec prettier --write ${files.map(quote).join(" ")}`;
};

const buildEslintCommand = (files) => {
  const webFiles = files.filter((file) => file.startsWith("apps/web/"));
  if (!webFiles.length) return null;
  return `npm exec --workspace apps/web eslint --max-warnings=0 --fix ${webFiles
    .map(quote)
    .join(" ")}`;
};

module.exports = {
  "*.{js,jsx,ts,tsx}": (files) => {
    const commands = [];

    const eslintCommand = buildEslintCommand(files);
    if (eslintCommand) commands.push(eslintCommand);

    if (files.some((file) => file.endsWith(".ts") || file.endsWith(".tsx"))) {
      // Run the full TS program check to keep the repo type-safe.
      commands.push("npm run type-check");
    }

    const prettierCommand = buildPrettierCommand(files);
    if (prettierCommand) commands.push(prettierCommand);

    return commands;
  },
  "*.{json,css,scss,md,mdx,yml,yaml}": (files) => {
    const prettierCommand = buildPrettierCommand(files);
    return prettierCommand ? [prettierCommand] : [];
  }
};
