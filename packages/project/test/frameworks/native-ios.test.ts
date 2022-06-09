import { NativeIosFramework } from '../../src/frameworks/native-ios';
import { MobileProject } from '../../src/project';

describe('frameworks: Native iOS', () => {
  let project: MobileProject;

  beforeEach(async () => { });

  it('should detect project', async () => {
    project = new MobileProject(
      '../common/test/fixtures/frameworks/NativeIosApp',
    );
    const fwk = await NativeIosFramework.getFramework(project);
    expect(fwk).not.toBe(null);
  });

  describe('ios', () => {
    let project: MobileProject;

    beforeEach(async () => {
      project = new MobileProject('../common/test/fixtures/frameworks/NativeIosApp', {
        ios: {
          path: '.'
        }
      });
      await project.load();
    });

    it('should find pbxproj', async () => {
      expect(await project.ios?.pbxprojName()).toBe('project.pbxproj');
    });

    it('should find xcodeproj', async () => {
      expect(await project.ios?.xcodeprojName()).toBe('NativeIosApp.xcodeproj');
    });
  });
});
