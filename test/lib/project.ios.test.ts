import { CapacitorConfig } from '@capacitor/cli';
import { CapacitorProject } from '../../lib';

describe('project - ios', () => {
  let config: CapacitorConfig;
  let project: CapacitorProject;
  beforeEach(async () => {
    config = {
      ios: {
        path: 'test/fixtures/ios'
      },
      android: {
        path: 'test/fixtures/android'
      }
    }

    project = new CapacitorProject(config);
    await project.ios.load();
  });

  it('should load project', async () => {
    expect(project.ios.getPbxProject()).not.toBe(null);
  });

  it('should load targets', async () => {
    const targets = project.ios.getTargets();
    expect(targets.length).toBe(5);
    expect(targets.every(t => t.buildConfigurations.length > 0)).toBe(true);
  });

  it('should get target by name', async () => {
    const target = project.ios.getTarget('App');
    expect(target).toBeDefined();
  });

  it('should get main app target', async () => {
    const target = project.ios.getAppTarget();
    expect(target).toBeDefined();
    expect(target.productName).toBe('App');
  });

  it('should get target bundle id', async () => {
    expect(project.ios.getBundleId('App', 'Debug')).toBe('io.ionic.wowzaStarter');
    expect(project.ios.getBundleId('\"My App Clip\"', 'Debug')).toBe('io.ionic.wowzaStarter.Clip');
  });

  it('should get target build configurations', async () => {
    expect(project.ios.getBuildConfigurations('App').length).toBe(2);
  });

  it('should set target bundle id', async () => {
    project.ios.setBundleId('App', 'Debug', 'io.ionic.betterBundleId');
    const newBundleId = project.ios.getBundleId('App', 'Debug');
    expect(newBundleId).toBe('io.ionic.betterBundleId');
  });

  it('should get target product name', async () => {
    expect(project.ios.getProductName('App')).toBe('App');
  });

  it('should get build number', async () => {
    expect(project.ios.getBuild('App', 'Debug')).toBe(1);
    expect(project.ios.incrementBuild('App', 'Debug'));
    expect(project.ios.getBuild('App', 'Debug')).toBe(2);
  });

  it('should update build settings', async () => {
    project.ios.setBuildProperty('App', 'Debug', 'FAKE_PROPERTY', 'YES');
    expect(project.ios.getBuildProperty('App', 'Debug', 'FAKE_PROPERTY')).toBe('YES');
  });

  it('should add frameworks', async () => {
    const fwks = ['ImageIO.framework', 'AudioToolbox.framework'];
    fwks.forEach(f => project.ios.addFramework('App', f));
    const frameworks = project.ios.getFrameworks('App');
    expect(fwks.every(f => frameworks.indexOf(f) >= 0)).toBe(true);
  });

  it('should add frameworks to non-app targets', async () => {
    const fwks = ['WebKit.framework', 'QuartzCore.framework'];
    fwks.forEach(f => project.ios.addFramework('\"My App Clip\"', f));
    const frameworks = project.ios.getFrameworks('\"My App Clip\"');
    expect(fwks.every(f => frameworks.indexOf(f) >= 0)).toBe(true);
  });

  it('should commit changes and reflect in fs', async () => {
  });
});
