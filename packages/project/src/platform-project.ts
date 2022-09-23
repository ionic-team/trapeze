import { MobileProject } from "./project";

export class PlatformProject {
  private error: Error | null = null;
  constructor(protected project: MobileProject) {}
  getError(): Error | null {
    return this.error;
  }
  setError(error: Error) {
    this.error = error;
  }
}