import { readFile, rmSync, writeFile } from '@ionic/utils-fs';
import { join } from 'path';
import sharp from 'sharp';

import type { AssetGeneratorOptions } from '../asset-generator';
import { AssetGenerator } from '../asset-generator';
import type { IosOutputAssetTemplate } from '../asset-types';
import { AssetKind, Format, IosIdiom, Platform } from '../asset-types';
import type { InputAsset } from '../input-asset';
import { OutputAsset } from '../output-asset';
import type { MobileProject } from '../../project';

export const IOS_APP_ICON_SET_NAME = 'AppIcon';
export const IOS_APP_ICON_SET_PATH = `App/Assets.xcassets/${IOS_APP_ICON_SET_NAME}.appiconset`;
// export const IOS_SPLASH_IMAGE_SET_NAME = 'Splash';
// export const IOS_SPLASH_IMAGE_SET_PATH = `App/Assets.xcassets/${IOS_SPLASH_IMAGE_SET_NAME}.imageset`;

export const IOS_1024_ICON: IosOutputAssetTemplate = {
  platform: Platform.Ios,
  idiom: IosIdiom.Universal,
  kind: AssetKind.Icon,
  name: 'AppIcon-512@2x.png',
  format: Format.Png,
  width: 1024,
  height: 1024,
};
export class IosAssetGenerator extends AssetGenerator {
  constructor(options: AssetGeneratorOptions = {}) {
    super(options);
  }

  async generate(asset: InputAsset, project: MobileProject): Promise<OutputAsset[]> {
    const iosDir = project.config.ios?.path;
    await asset.load()

    if (!iosDir) {
      throw new Error('No ios project found');
    }

    if (asset.platform !== Platform.Any && asset.platform !== Platform.Ios) {
      return [];
    }

    switch (asset.kind) {
      case AssetKind.Logo:
      case AssetKind.LogoDark:
        return this.generateFromLogo(asset, project);
      case AssetKind.Icon:
        return this.generateIcons(asset, project, [IOS_1024_ICON]);
    }

    return [];
  }

  private async generateFromLogo(asset: InputAsset, project: MobileProject): Promise<OutputAsset[]> {
    const pipe = asset.pipeline();

    if (!pipe) {
      throw new Error('Sharp instance not created');
    }

    const iosDir = project.config.ios!.path!;

    // Generate logos
    let logos: OutputAsset[] = [];
    if (asset.kind === AssetKind.Logo) {
      logos = await this.generateIcons(asset, project, [IOS_1024_ICON]);
    }

    return [...logos];
  }

  private async generateIcons(
    asset: InputAsset,
    project: MobileProject,
    icons: IosOutputAssetTemplate[],
  ): Promise<OutputAsset[]> {
    const pipe = asset.pipeline();

    if (!pipe) {
      throw new Error('Sharp instance not created');
    }

    const iosDir = project.config.ios!.path!;
    const lightDefaultBackground = '#ffffff';
    const generated = await Promise.all(
      icons.map(async (icon) => {
        const dest = join(iosDir, IOS_APP_ICON_SET_PATH, icon.name);

        const outputInfo = await pipe
          .resize(icon.width, icon.height)
          .png()
          .flatten({ background: this.options.iconBackgroundColor ?? lightDefaultBackground })
          .toFile(dest);

        return new OutputAsset(
          icon,
          asset,
          project,
          {
            [icon.name]: dest,
          },
          {
            [icon.name]: outputInfo,
          },
        );
      }),
    );

    await this.updateIconsContentsJson(generated, project);

    return generated;
  }

  private async updateIconsContentsJson(generated: OutputAsset[], project: MobileProject) {
    const assetsPath = join(project.config.ios!.path!, IOS_APP_ICON_SET_PATH);
    const contentsJsonPath = join(assetsPath, 'Contents.json');
    const json = await readFile(contentsJsonPath, { encoding: 'utf-8' });

    const parsed = JSON.parse(json);

    const withoutMissing = [];
    for (const g of generated) {
      const width = g.template.width;
      const height = g.template.height;

      parsed.images.map((i: any) => {
        if (i.filename !== (g.template as IosOutputAssetTemplate).name) {
          rmSync(join(assetsPath, i.filename));
        }
      });

      withoutMissing.push({
        idiom: (g.template as IosOutputAssetTemplate).idiom,
        size: `${width}x${height}`,
        filename: (g.template as IosOutputAssetTemplate).name,
        platform: Platform.Ios,
      });
    }

    parsed.images = withoutMissing;

    await writeFile(contentsJsonPath, JSON.stringify(parsed, null, 2));
  }
}
