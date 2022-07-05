#!/usr/bin/env node
'use strict';

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection', err);
  throw err;
});

// import { run } from '../dist/cli';
import { parseFromArgs } from '../dist/index.js';

parseFromArgs();
