import { FlutterFramework } from '../../src/frameworks/flutter';
import { MobileProject } from '../../src/project';

describe('frameworks: Flutter', () => {
  let project: MobileProject;

  beforeEach(async () => {
    project = new MobileProject('../common/test/fixtures/frameworks/flutter_configure_test');
  });

  it('should detect flutter project', async () => {
    expect(await FlutterFramework.getFramework(project)).not.toBe(null);
  });

  describe('ios', () => {
    let project: MobileProject;

    beforeEach(async () => {
      project = new MobileProject('../common/test/fixtures/frameworks/flutter_configure_test', {
        ios: {
          path: 'ios'
        },
        android: {
          path: 'android'
        }
      });
      await project.load();
    });

    it('should find pbxproj', async () => {
      expect(await project.ios?.pbxprojName()).toBe('project.pbxproj');
    });

    it('should find xcodeproj', async () => {
      expect(await project.ios?.xcodeprojName()).toBe('Runner.xcodeproj');
    });
  });
});
