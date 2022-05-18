import { ReactNativeFramework } from '../../src/frameworks/react-native';
import { MobileProject } from '../../src/project';

describe('frameworks: React Native', () => {
  let project: MobileProject;

  beforeEach(async () => {
  });

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
});
