import { CordovaFramework } from '../../src/frameworks/cordova';
import { MobileProject } from '../../src/project';

describe('frameworks: Cordova', () => {
  let project: MobileProject;

  beforeEach(async () => { });

  it('should detect Cordova project', async () => {
    project = new MobileProject(
      '../common/test/fixtures/frameworks/CordovaApp',
    );
    const fwk = await CordovaFramework.getFramework(project);
    expect(fwk).not.toBe(null);
  });
});
