require('babel-register')({
  presets: ['env'],
});
require('babel-polyfill');
// eslint-disable-next-line no-unused-expressions
require('./server').default;
