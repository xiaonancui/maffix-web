module.exports = {
  // 基本格式化选项
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,

  // JSX 特定选项
  jsxSingleQuote: true,
  jsxBracketSameLine: false,

  // 其他选项
  arrowParens: 'avoid',
  bracketSpacing: true,
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'css',
  insertPragma: false,
  proseWrap: 'preserve',
  quoteProps: 'as-needed',
  requirePragma: false,

  // 文件特定覆盖
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
    {
      files: '*.yml',
      options: {
        tabWidth: 2,
      },
    },
    {
      files: '*.yaml',
      options: {
        tabWidth: 2,
      },
    },
  ],
};
