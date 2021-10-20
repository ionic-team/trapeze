import plist from 'plist';
import xcode from 'xcode';
import { join } from 'path';
import { readFile, writeFile } from '@ionic/utils-fs';

import { Context } from '../../ctx';
import { IosOperation, Operation } from '../../op';

export default async function execute(ctx: Context, op: IosOperation) {
  if (op.id === 'ios.bundleId') {
    return ctx.project.ios.setBundleId(op.target, op.build, op.value);
  }

  if (op.id === 'ios.displayName') {
    return ctx.project.ios.setDisplayName(op.target, op.build, op.value);
  }

  if (op.id === 'ios.productName') {
    return ctx.project.ios.setProductName(op.target, op.value);
  }
}