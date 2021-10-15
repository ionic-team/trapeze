import { writeFile } from "@ionic/utils-fs";

export interface ChangeInfo {
  file?: string;
  data?: Buffer | string | any;
  extra?: any;
}

export type ChangeCommitStrategy = (change: Change) => Promise<void>;

/**
 * A representation of a change to a project, such as a modification to a
 * configuration file.
 */
export class Change {
  /**
   * Default change strategy that simply writes the data to a file.
   */
  public static WriteFileChangeCommitStrategy: ChangeCommitStrategy = (change: Change) => {
    return writeFile(change.info.file, change.info.data);
  }

  constructor(public info: ChangeInfo, private commitStrategy: ChangeCommitStrategy) {
  }

  async commit() {
    return this.commitStrategy(this);
  }
}