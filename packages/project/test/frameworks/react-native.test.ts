import { ReactNativeFramework } from '../../src/frameworks/react-native';
import { MobileProject } from '../../src/project';

describe('frameworks: React Native', () => {
  let project: MobileProject;

  it('should detect standard React Native project', async () => {
    project = new MobileProject('../common/test/fixtures/frameworks/ReactNativeProject');
    const fwk = await ReactNativeFramework.getFramework(project);
    expect(fwk).not.toBe(null);
    expect(fwk!.isExpo).toBe(false);
  });

  it('should detect expo React Native project', async () => {
    project = new MobileProject('../common/test/fixtures/frameworks/ReactNativeExpo');
    const fwk = await ReactNativeFramework.getFramework(project);
    expect(fwk).not.toBe(null);
    expect(fwk!.isExpo).toBe(true);
  });

  describe('ios', () => {
    let project: MobileProject;

    beforeEach(async () => {
      project = new MobileProject('../common/test/fixtures/frameworks/ReactNativeProject', {
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
      expect(await project.ios?.xcodeprojName()).toBe('ReactNativeProject.xcodeproj');
    });
  });
});
