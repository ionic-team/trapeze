import { pathExists } from "@ionic/utils-fs";
import { join } from 'path';
import { Framework } from ".";
import { MobileProject } from "../project";

export class CordovaFramework extends Framework {
  constructor() {
    super();
  }
  
  static async getFramework(project: MobileProject) {
    if (!project.config.projectRoot) {
      return null;
    }

    const paths = ['config.xml'];

    if ((await Promise.all(paths.map(p => pathExists(join(project.config.projectRoot!, p))))).some(s => s)) {
      return new CordovaFramework();
    }

    return null;
  }
}