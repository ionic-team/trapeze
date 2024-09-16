import type {
  AndroidOutputAssetTemplate,
  AndroidOutputAssetTemplateAdaptiveIcon
} from '../asset-types';
import { AssetKind, AndroidDensity, Format, Platform } from '../asset-types';

export const ANDROID_LDPI_ICON: AndroidOutputAssetTemplate = {
  platform: Platform.Android,
  kind: AssetKind.Icon,
  format: Format.Png,
  width: 36,
  height: 36,
  density: AndroidDensity.Ldpi,
};

export const ANDROID_MDPI_ICON: AndroidOutputAssetTemplate = {
  platform: Platform.Android,
  kind: AssetKind.Icon,
  format: Format.Png,
  width: 48,
  height: 48,
  density: AndroidDensity.Mdpi,
};

export const ANDROID_HDPI_ICON: AndroidOutputAssetTemplate = {
  platform: Platform.Android,
  kind: AssetKind.Icon,
  format: Format.Png,
  width: 72,
  height: 72,
  density: AndroidDensity.Hdpi,
};

export const ANDROID_XHDPI_ICON: AndroidOutputAssetTemplate = {
  platform: Platform.Android,
  kind: AssetKind.Icon,
  format: Format.Png,
  width: 96,
  height: 96,
  density: AndroidDensity.Xhdpi,
};

export const ANDROID_XXHDPI_ICON: AndroidOutputAssetTemplate = {
  platform: Platform.Android,
  kind: AssetKind.Icon,
  format: Format.Png,
  width: 144,
  height: 144,
  density: AndroidDensity.Xxhdpi,
};

export const ANDROID_XXXHDPI_ICON: AndroidOutputAssetTemplate = {
  platform: Platform.Android,
  kind: AssetKind.Icon,
  format: Format.Png,
  width: 192,
  height: 192,
  density: AndroidDensity.Xxxhdpi,
};

/**
 * Adaptive icons
 */
export const ANDROID_LDPI_ADAPTIVE_ICON: AndroidOutputAssetTemplateAdaptiveIcon = {
  platform: Platform.Android,
  kind: AssetKind.AdaptiveIcon,
  format: Format.Png,
  width: 81,
  height: 81,
  density: AndroidDensity.Ldpi,
};

export const ANDROID_MDPI_ADAPTIVE_ICON: AndroidOutputAssetTemplateAdaptiveIcon = {
  platform: Platform.Android,
  kind: AssetKind.AdaptiveIcon,
  format: Format.Png,
  width: 108,
  height: 108,
  density: AndroidDensity.Mdpi,
};

export const ANDROID_HDPI_ADAPTIVE_ICON: AndroidOutputAssetTemplateAdaptiveIcon = {
  platform: Platform.Android,
  kind: AssetKind.AdaptiveIcon,
  format: Format.Png,
  width: 162,
  height: 162,
  density: AndroidDensity.Hdpi,
};

export const ANDROID_XHDPI_ADAPTIVE_ICON: AndroidOutputAssetTemplateAdaptiveIcon = {
  platform: Platform.Android,
  kind: AssetKind.AdaptiveIcon,
  format: Format.Png,
  width: 216,
  height: 216,
  density: AndroidDensity.Xhdpi,
};

export const ANDROID_XXHDPI_ADAPTIVE_ICON: AndroidOutputAssetTemplateAdaptiveIcon = {
  platform: Platform.Android,
  kind: AssetKind.AdaptiveIcon,
  format: Format.Png,
  width: 324,
  height: 324,
  density: AndroidDensity.Xxhdpi,
};

export const ANDROID_XXXHDPI_ADAPTIVE_ICON: AndroidOutputAssetTemplateAdaptiveIcon = {
  platform: Platform.Android,
  kind: AssetKind.AdaptiveIcon,
  format: Format.Png,
  width: 432,
  height: 432,
  density: AndroidDensity.Xxxhdpi,
};
