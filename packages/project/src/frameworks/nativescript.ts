import { pathExists } from "@ionic/utils-fs";
import { join } from 'path';

import { Framework } from ".";
import { MobileProject } from "../project";

export class NativeScriptFramework extends Framework {
  constructor() {
    super();
  }

  static async getFramework(project: MobileProject) {
    if (!project.config.projectRoot) {
      return false;
    }

    if (!(await pathExists(join(project.config.projectRoot, 'nativescript.config.ts')))) {
      return null;
    }

    return new NativeScriptFramework();
  }
}