import { copy } from '@ionic/utils-fs';
import { XCConfigFile } from '@trapezedev/project/src';
import { join } from 'path';
import tempy from 'tempy';

import { Context, loadContext } from '../../src/ctx';
import { IosSpmPackagesOperation, Operation } from '../../src/definitions';
import Op from '../../src/operations/ios/spmPackages';

describe('op: ios.spmPackages', () => {
  let dir: string;
  let ctx: Context;

  beforeEach(async () => {
    dir = tempy.directory();

    await copy('../common/test/fixtures/ios-and-android', dir);

    ctx = await loadContext(dir);
    ctx.args.quiet = true;
  });

  it('should set ios.spmPackages', async () => {
    const op: IosSpmPackagesOperation = {
      value: [
        {
          name: 'swift-numerics',
          libs: ['Numberics'],
          repositoryURL: 'https://github.com/apple/swift-numerics.git',
          version: '1.0.0'
        },
        {
          name: 'local-swift-numerics',
          libs: ['Numberics'],
          path: '../path/to/local-swift-numerics'
        },
      ],
    };

    await Op(ctx, op as Operation);

    const pbxProject = ctx.project.ios?.getPbxProject()
    const pbxProjectText = pbxProject?.writeSync()

    expect(pbxProjectText).toContain('https://github.com/apple/swift-numerics.git')
    expect(pbxProjectText).toContain('../path/to/local-swift-numerics')
  });
});
