module.exports = {
  core: {
    builder: 'webpack5',
  },
  typescript: { reactDocgen: false },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-next-router",
    'storybook-addon-mock'
  ],
  "framework": "@storybook/react",
}