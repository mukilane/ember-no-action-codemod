'use strict';

const { runTransformTest } = require('codemod-cli');

runTransformTest({ 
  name: 'no-action-js',
  path: require.resolve('./index.js'),
  fixtureDir: `${__dirname}/__testfixtures__/`,
});