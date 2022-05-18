import { pathExists, readdir } from "@ionic/utils-fs";
import { join } from 'path';

import { Framework } from ".";
import { MobileProject } from "../project";

export class NativeIosFramework extends Framework {
  constructor() {
    super();
  }

  static async getFramework(project: MobileProject) {
    if (!project.config.projectRoot) {
      return false;
    }

    const files = await readdir(project.config.projectRoot);

    if (!(files.some(f => f.indexOf('.xcodeproj') >= 0))) {
      return null;
    }

    return new NativeIosFramework();
  }
}