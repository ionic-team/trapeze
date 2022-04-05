import { Subprocess, SubprocessError } from "@ionic/utils-subprocess";
import { spawn } from 'cross-spawn';
import chalk from "chalk";

export async function runCommand(command: string, args: string[], options = {}): Promise<string> {
  // console.log(chalk`> {bold ${command} ${args.join(" ")}}`);

  const p = new Subprocess(command, args, options);

  try {
    // return await p.output();
    await p.run();

    return p.output();
  } catch (e) {
    if (e instanceof SubprocessError) {
      // old behavior of just throwing the stdout/stderr strings
      throw e.output
        ? e.output
        : e.code
          ? e.code
          : e.error
            ? e.error.message
            : "Unknown error";
    }

    throw e;
  }
}

export async function spawnCommand(command: string, args: string[], options = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);
    const stderr: string[] = [];
    const stdout: string[] = [];
    child.stdout?.addListener('data', e => {
      stdout.push(e.toString());
    });
    child.stderr?.addListener('data', e => {
      stderr.push(e.toString());
    });
    child.on('exit', e => {
    });
    child.on('error', e => {
    });
    child.on('close', e => {
      if (e) {
        reject(stderr.join());
      } else {
        resolve(stdout.join(''));
      }
    });
  });
}