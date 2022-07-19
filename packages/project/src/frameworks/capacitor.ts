import { pathExists } from "@ionic/utils-fs";
import { join } from 'path';
import { Framework } from ".";
import { MobileProject } from "../project";

export class CapacitorFramework extends Framework {
  constructor() {
    super();
  }

  static async getFramework(project: MobileProject) {
    if (!project.config.projectRoot) {
      return null;
    }

    const paths = ['capacitor.config.ts', 'capacitor.config.js', 'capacitor.config.json'];

    if ((await Promise.all(paths.map(p => pathExists(join(project.config.projectRoot!, p))))).some(s => s)) {
      return new CapacitorFramework();
    }

    return null;
  }
}