import kleur from "kleur";

export class Logger {
  static debug(...args: any[]) {
    if(process.env.VERBOSE !== 'false') {
      console.log(kleur.bold().grey('[log]'), ...args);
    }
  }

  static v(platform: string, op: string, ...args: any[]) {
    this.debug(`${kleur.yellow(platform)}(${kleur.cyan(op)})`, ...args);
  }

  static log(...args: any[]) {
    console.log(...args);
  }

  static warn(...args: any[]) {
    console.warn(...args);
  }

  static error(...args: any[]) {
    console.warn(...args);
  }
}