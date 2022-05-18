import { MobileProject } from "../project";

export class Framework {
  static getFramework(project: MobileProject): Promise<Framework | null> {
    return Promise.resolve(null);
  }
}