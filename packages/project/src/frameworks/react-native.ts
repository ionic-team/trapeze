import { pathExists, readJSON } from "@ionic/utils-fs";
import { join } from 'path';

import { Framework } from ".";
import { MobileProject } from "../project";

export class ReactNativeFramework extends Framework {
  constructor(public isExpo: boolean) {
    super();
  }

  static async getFramework(project: MobileProject): Promise<ReactNativeFramework | null> {
    if (!project.config.projectRoot) {
      return null;
    }

    if (!(await pathExists(join(project.config.projectRoot, 'app.json')))) {
      return null;
    }

    const packageJson = (await readJSON(join(project.config.projectRoot, 'package.json'))) ?? {};

    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    if (!('react-native' in deps)) {
      return null;
    }

    if ('expo' in deps) {
      return new ReactNativeFramework(true);
    }

    return new ReactNativeFramework(false);
  }
}