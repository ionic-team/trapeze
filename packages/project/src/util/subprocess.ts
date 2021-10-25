import { Subprocess, SubprocessError } from "@ionic/utils-subprocess";
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