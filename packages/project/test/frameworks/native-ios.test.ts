import { NativeIosFramework } from '../../src/frameworks/native-ios';
import { MobileProject } from '../../src/project';

describe('frameworks: Native iOS', () => {
  let project: MobileProject;

  beforeEach(async () => { });

  it('should detect project', async () => {
    project = new MobileProject(
      '../common/test/fixtures/frameworks/NativeIos',
    );
    const fwk = await NativeIosFramework.getFramework(project);
    expect(fwk).not.toBe(null);
  });
});
