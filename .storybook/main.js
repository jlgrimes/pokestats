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
    'storybook-addon-mock',
    'storybook-addon-manual-mocks'
  ],
  "framework": "@storybook/react",
  webpackFinal: (config) => {
    config.resolve.alias['next-auth/react'] = require.resolve('../__mocks__/next-auth.ts');
    return config;
  },
}