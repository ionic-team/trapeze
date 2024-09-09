import type { OutputInfo } from 'sharp';

import type { OutputAssetTemplate } from './asset-types';
import type { InputAsset } from './input-asset';
import type { MobileProject } from '../project';

/**
 * An instance of a generated asset
 */
export class OutputAsset<OutputAssetTemplateType = OutputAssetTemplate> {
  constructor(
    public template: OutputAssetTemplateType,
    public asset: InputAsset,
    public project: MobileProject,
    public destFilenames: { [name: string]: string },
    public outputInfoMap: { [name: string]: OutputInfo },
  ) {}

  getDestFilename(assetName: string): string {
    return this.destFilenames[assetName];
  }

  getOutputInfo(assetName: string): OutputInfo {
    return this.outputInfoMap[assetName];
  }
}
