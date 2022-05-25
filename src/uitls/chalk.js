const chalk = require('chalk');

const success = (msg) => chalk.green(msg)

const error = (msg) => chalk.red(msg)

const warn = (msg) => chalk.yellow(msg)

const underline = (msg) => chalk.underline(msg)

module.exports = {
  success,
  error,
  warn,
  underline
};
