import { pathExists } from "@ionic/utils-fs";
import { join } from 'path';

import { Framework } from ".";
import { MobileProject } from "../project";

export class DotNetMauiFramework extends Framework {
  constructor() {
    super();
  }

  static async getFramework(project: MobileProject) {
    if (!project.config.projectRoot) {
      return null;
    }

    if (!(await pathExists(join(project.config.projectRoot, 'App.xaml')))) {
      return null;
    }

    return new DotNetMauiFramework();
  }
}