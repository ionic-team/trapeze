import { NativeAndroidFramework } from '../../src/frameworks/native-android';
import { MobileProject } from '../../src/project';

describe('frameworks: Native Android', () => {
  let project: MobileProject;

  beforeEach(async () => { });

  it('should detect project', async () => {
    project = new MobileProject(
      '../common/test/fixtures/frameworks/NativeAndroidApp',
    );
    const fwk = await NativeAndroidFramework.getFramework(project);
    expect(fwk).not.toBe(null);
  });
});
