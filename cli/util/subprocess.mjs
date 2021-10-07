import { Subprocess, SubprocessError } from "@ionic/utils-subprocess";
import chalk from "chalk";

export async function runCommand(command, args, options = {}) {
  console.log(chalk`> {bold ${command} ${args.join(" ")}}`);

  const p = new Subprocess(command, args, options);

  try {
    // return await p.output();
    return await p.run();
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
