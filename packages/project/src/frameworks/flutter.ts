import { pathExists } from "@ionic/utils-fs";
import { join } from 'path';

import { Framework } from ".";
import { MobileProject } from "../project";

export class FlutterFramework extends Framework {
  constructor() {
    super();
  }

  static async getFramework(project: MobileProject) {
    if (!project.config.projectRoot) {
      return false;
    }

    if (!(await pathExists(join(project.config.projectRoot, 'pubspec.yaml')))) {
      return null;
    }

    return new FlutterFramework();
  }
}