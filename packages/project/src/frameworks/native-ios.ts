import { pathExists } from "@ionic/utils-fs";
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

    return new NativeIosFramework();
  }
}