import { dirname, join } from 'path';
import { runCommand } from '../util/subprocess';

export class Gradle {
  constructor(private filename: string) {
  }

  async parse() {
    const parserRoot = this.getGradleParserPath();
    const java = this.getJava();
    console.log('Parsing!', java);

    if (!java) {
      throw new Error(this.gradleParseError());
    }

    const json = await runCommand(java, ['-cp', 'lib/*:capacitor-gradle-parse.jar:.', 'com.capacitorjs.gradle.Parse', this.filename], {
      cwd: parserRoot
    });

    return JSON.parse(json || '{}');
  }

  verifyJavaHome() {
    if (!process.env.JAVA_HOME) {
      return false;
    }
    return true;
  }

  getJava(): string | null {
    if (process.env.JAVA_HOME) {
      return join(process.env.JAVA_HOME, 'bin', 'java');
    }
    return null;
  }

  getGradleParserPath() {
    return dirname(require.resolve('@capacitor/gradle-parse'));
  }

  private gradleParseError() {
    return `JAVA_HOME not set or set incorrectly. Please set JAVA_HOME to the root of your Java installation.\n\nGradle parse functionality depends on a local Java install for accurate Gradle file modification.`
  }
}