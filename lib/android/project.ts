import { join } from 'path';

import { CapacitorProject } from "../project";

import { parseXml, serializeXml, writeXml } from '../util/xml';

export class AndroidProject {
  constructor(private project: CapacitorProject) {
  }

  async setPackageName(packageName: string) {
    const manifestFilename = this.getAndroidManifestPath();
    const doc = await parseXml(manifestFilename);

    doc.documentElement.setAttribute('package', packageName);

    const serialized = serializeXml(doc);
  }

  async setVersionName(versionName: string) {
  }

  async incrementVersionCode() {
  }

  private getAndroidManifestPath() {
    return join(this.project.config.android?.path, 'app', 'src', 'main', 'AndroidManifest.xml');
  }
}