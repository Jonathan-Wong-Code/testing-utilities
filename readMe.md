Setting up jest:

Install yarn add --dev babel-jest @babel/core @babel/preset-env

Yarn add @testing-library/react, @testing-library/jest-dom, react-test-renderer, jest-styled-components jest-cli jest

babel.config.js

module.exports = {
presets: [
[
'@babel/preset-env',
{
modules: false,
},
],
'@babel/preset-react',
],
plugins: [
'lodash',
'@babel/plugin-proposal-class-properties',
'@babel/plugin-syntax-dynamic-import',
'@babel/plugin-transform-runtime',
],
env: {
production: {
only: ['app'],
plugins: [
'lodash',
'@babel/plugin-transform-react-inline-elements',
'@babel/plugin-transform-react-constant-elements',
],
},
test: {
plugins: [
'@babel/plugin-transform-modules-commonjs',
'dynamic-import-node',
],
},
},
};

RESOURCES

Adding DotEnv and testing env vars: https://dev.to/ddialar/jest-with-global-dotenv-configuration-cgo
