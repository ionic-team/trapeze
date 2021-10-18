import plist from 'plist';
import xcode from 'xcode';
import { join } from 'path';
import { readFile, writeFile } from '@ionic/utils-fs';

import { Context } from '../../ctx';
import { Operation } from '../../op';
import { Change } from '../../../lib/change';

export default async function execute(ctx: Context, op: Operation) {
  const iosProject = ctx.project.ios;

  if (op.id === 'ios.bundleId') {
    // return iosProject.setBundleId(op.value);
  }

  if (op.id === 'ios.displayName') {
    // proj.updateProductName(op.value);
    // return iosProject.setDisplayName(op.value);
  }

  if (op.id === 'ios.productName') {
    // return iosProject.setProductName(op.value);
  }
}