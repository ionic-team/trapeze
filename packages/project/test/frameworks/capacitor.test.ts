import { CapacitorFramework } from '../../src/frameworks/capacitor';
import { DotNetMauiFramework } from '../../src/frameworks/dotnet-maui';
import { MobileProject } from '../../src/project';

describe('frameworks: Capacitor', () => {
  let project: MobileProject;

  beforeEach(async () => {});

  it('should detect project', async () => {
    project = new MobileProject('../common/test/fixtures/ios-and-android', {
      ios: {
        path: 'ios/App'
      },
      android: {
        path: 'android'
      }
    });
    await project.load();

    const fwk = await CapacitorFramework.getFramework(project);
    expect(fwk).not.toBe(null);
  });

  it('should find pbxproj', async () => {
    expect(await project.ios?.pbxprojName()).toBe('project.pbxproj');
  });

  it('should find xcodeproj', async () => {
    expect(await project.ios?.xcodeprojName()).toBe('App.xcodeproj');
  });
});
