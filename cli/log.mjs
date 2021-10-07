import chalk from 'chalk';

export function debug(...args) {
  if (process.env.VERBOSE) {
    console.log(...args);
  }
}
export function log(...args) {
  console.log(...args);
}

export function warn(...args) {
  console.warn(...args);
}

export function error(...args) {
  console.warn(...args);
}

export function fatal(msg, exc) {
  console.error(chalk`{red.bold Fatal error: ${msg}}`);
  if (exc) {
    console.error(exc);
  }
  process.exit(1);
}
