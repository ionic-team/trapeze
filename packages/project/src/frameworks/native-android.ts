import { pathExists } from "@ionic/utils-fs";
import { join } from 'path';

import { Framework } from ".";
import { MobileProject } from "../project";

export class NativeAndroidFramework extends Framework {
  constructor() {
    super();
  }

  static async getFramework(project: MobileProject) {
    if (!project.config.projectRoot) {
      return false;
    }

    if (!(await pathExists(join(project.config.projectRoot, 'build.gradle')))) {
      return null;
    }

    return new NativeAndroidFramework();
  }
}