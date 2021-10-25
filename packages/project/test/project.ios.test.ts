import { CapacitorConfig } from '@capacitor/cli';
import { CapacitorProject } from '../src';

describe('project - ios', () => {
  let config: CapacitorConfig;
  let project: CapacitorProject;
  beforeEach(async () => {
    config = {
      ios: {
        path: '../common/test/fixtures/ios'
      },
      android: {
        path: '../common/test/fixtures/android'
      }
    }

    project = new CapacitorProject(config);
    await project.load();
  });

  it('should load project', async () => {
    expect(project.ios.getPbxProject()).not.toBe(null);
  });

  it('should load targets', async () => {
    const targets = project.ios.getTargets();
    expect(targets?.length).toBe(5);
    expect(targets?.every(t => t.buildConfigurations.length > 0)).toBe(true);
  });

  it('should get target by name', async () => {
    const target = project.ios.getTarget('App');
    expect(target).toBeDefined();
  });

  it('should get main app target', async () => {
    const target = project.ios.getAppTarget();
    expect(target).toBeDefined();
    expect(target?.productName).toBe('App');
  });

  it('should get target bundle id', async () => {
    expect(project.ios.getBundleId('App', 'Debug')).toBe('io.ionic.wowzaStarter');
    expect(project.ios.getBundleId('App')).toBe('io.ionic.wowzaStarter');
    expect(project.ios.getBundleId('My App Clip', 'Debug')).toBe('io.ionic.wowzaStarter.Clip');
  });

  it('should get target build configurations', async () => {
    const configs = project.ios.getBuildConfigurations('App');
    expect(configs.length).toBe(2);
  });

  it('should get target build configuration names', async () => {
    const configs = project.ios.getBuildConfigurationNames('App');
    expect(configs).toMatchObject(['Debug', 'Release']);
  });

  it('should set target bundle id', async () => {
    project.ios.setBundleId('App', 'Debug', 'io.ionic.betterBundleId');
    let debugBundleId = project.ios.getBundleId('App', 'Debug');
    let releaseBundleId = project.ios.getBundleId('App', 'Release');
    expect(debugBundleId).toBe('io.ionic.betterBundleId');
    expect(releaseBundleId).not.toBe('io.ionic.betterBundleId');

    // Test if passing null as a build sets the value for both release and debug
    project.ios.setBundleId('App', null, 'io.ionic.betterBundleId');
    debugBundleId = project.ios.getBundleId('App', 'Debug');
    releaseBundleId = project.ios.getBundleId('App', 'Release');
    expect(debugBundleId).toBe('io.ionic.betterBundleId');
    expect(releaseBundleId).toBe('io.ionic.betterBundleId');
  });

  it('should get target product name', async () => {
    expect(project.ios.getProductName('App')).toBe('App');
  });

  it('should get build number', async () => {
    expect(project.ios.getBuild('App', 'Debug')).toBe(1);
    expect(project.ios.getBuild('App', 'Release')).toBe(1);
    expect(project.ios.incrementBuild('App', 'Debug'));
    expect(project.ios.getBuild('App', 'Debug')).toBe(2);
    expect(project.ios.getBuild('App', 'Release')).toBe(1);
    expect(project.ios.incrementBuild('App'));
    expect(project.ios.getBuild('App', 'Debug')).toBe(2);
    expect(project.ios.getBuild('App', 'Release')).toBe(2);
  });

  it('should update build settings', async () => {
    project.ios.setBuildProperty('App', 'Debug', 'FAKE_PROPERTY', 'YES');
    expect(project.ios.getBuildProperty('App', 'Debug', 'FAKE_PROPERTY')).toBe('YES');
    project.ios.setBuildProperty('App', 'Release', 'FAKE_PROPERTY', 'YES');
    expect(project.ios.getBuildProperty('App', 'Release', 'FAKE_PROPERTY')).toBe('YES');
    project.ios.setBuildProperty('App', null, 'THING', 'THIS');
    expect(project.ios.getBuildProperty('App', 'Debug', 'THING')).toBe('THIS');
    expect(project.ios.getBuildProperty('App', 'Release', 'THING')).toBe('THIS');
  });

  it('should add frameworks', async () => {
    const fwks = ['ImageIO.framework', 'AudioToolbox.framework'];
    fwks.forEach(f => project.ios.addFramework('App', f));
    const frameworks = project.ios.getFrameworks('App');
    expect(fwks.every(f => frameworks.indexOf(f) >= 0)).toBe(true);
  });

  it('should add frameworks to non-app targets', async () => {
    const fwks = ['WebKit.framework', 'QuartzCore.framework'];
    fwks.forEach(f => project.ios.addFramework('My App Clip', f));
    const frameworks = project.ios.getFrameworks('My App Clip');
    expect(fwks.every(f => frameworks.indexOf(f) >= 0)).toBe(true);
  });

  it('should get entitlements file for each target', async () => {
    expect(project.ios.getEntitlementsFile('App', 'Debug')).toBe('App/App.entitlements');
    expect(project.ios.getEntitlementsFile('App', 'Release')).toBe('App/App.entitlements');
    expect(project.ios.getEntitlementsFile('My App Clip', 'Debug')).toBe('My App Clip/My_App_Clip.entitlements');
    expect(project.ios.getEntitlementsFile('My App Clip', 'Release')).toBe('My App Clip/My_App_Clip.entitlements');
    expect(project.ios.getEntitlementsFile('My Share Extension', 'Debug')).toBeUndefined();
    expect(project.ios.getEntitlementsFile('My Share Extension', 'Release')).toBeUndefined();
  });

  it('should add entitlements to file', async () => {
    await project.ios.addEntitlements('App', 'Debug', {
      'keychain-access-groups': [
        'group1', 'group2'
      ]
    });

    let entitlements = await project.ios.getEntitlements('App', 'Debug');
    expect(entitlements).toEqual({
      'keychain-access-groups': [
        'group1', 'group2'
      ]
    });

    await project.ios.addEntitlements('App', null, {
      'keychain-access-groups': [
        'group3', 'group4'
      ]
    });

    entitlements = await project.ios.getEntitlements('App');
    expect(entitlements).toEqual({
      'keychain-access-groups': [
        'group3', 'group4', 'group1', 'group2'
      ]
    });
  });

  it('should get info.plist for each target', async () => {
    expect(project.ios.getInfoPlist('App', 'Debug')).toBe('App/Info.plist');
    expect(project.ios.getInfoPlist('App', 'Release')).toBe('App/Info.plist');
    expect(project.ios.getInfoPlist('App')).toBe('App/Info.plist');
    expect(project.ios.getInfoPlist('My App Clip', 'Debug')).toBe('My App Clip/AppClip.plist');
    expect(project.ios.getInfoPlist('My App Clip', 'Release')).toBe('My App Clip/AppClip.plist');
    expect(project.ios.getInfoPlist('My Share Extension', 'Debug')).toBe('My Share Extension/Info.plist');
    expect(project.ios.getInfoPlist('My Share Extension', 'Release')).toBe('My Share Extension/Info.plist');
  });

  it('should set display name for target', async () => {
    await project.ios.setDisplayName('App', 'Debug', 'Super App');
    expect(await project.ios.getDisplayName('App', 'Debug')).toBe('Super App');
  });

  it('should update plist with entries', async () => {
    await project.ios.updateInfoPlist('App', 'Debug', {
      NSFaceIDUsageDescription: 'The better to see you with'
    });

    const filename = project.ios.getInfoPlistFilename('App', 'Debug');
    const updated = project.vfs.get(filename!)?.getData();
    expect(updated['NSFaceIDUsageDescription']).toBe('The better to see you with');
  });

  it('should commit changes and reflect in fs', async () => {
  });
});
