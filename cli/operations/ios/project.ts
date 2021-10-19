import plist from 'plist';
import xcode from 'xcode';
import { join } from 'path';
import { readFile, writeFile } from '@ionic/utils-fs';

import { Context } from '../../ctx';
import { Operation } from '../../op';

export default async function execute(ctx: Context, op: Operation) {
  const iosProject = ctx.project.ios;

  if (op.id === 'ios.bundleId') {
    // return ctx.project.ios.setBundleId(op.value);
  }

  if (op.id === 'ios.displayName') {
    // return ctx.project.ios.setDisplayName(op.value);
  }

  if (op.id === 'ios.productName') {
    // return ctx.project.ios.setProductName(op.value);
  }
}