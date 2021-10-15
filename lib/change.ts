import { writeFile } from "@ionic/utils-fs";

export interface ChangeInfo {
  file: string;
  data: Buffer | string;
}

export class Change {
  constructor(public info: ChangeInfo) {
  }

  async commit() {
    const { file, data } = this.info;

    await writeFile(file, data);
  }
}