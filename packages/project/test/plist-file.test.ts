import { PlistFile } from '../src/plist';
import { serializeXml } from '../src/util/xml';
import { VFS } from '../src/vfs';

describe('xml file', () => {
  let vfs: VFS;
  let file: PlistFile;

  beforeEach(async () => {
    vfs = new VFS();
    file = new PlistFile('../common/test/fixtures/ios-and-android/ios/App/My App Clip/AppClip.plist', vfs);
    await file.load();
  });

  it('Should load xml file', async () => {
    const doc = file.getDocument();
    expect(doc).toMatchObject({
      NSAppClip: {
        NSAppClipRequestEphemeralUserNotification: false,
        NSAppClipRequestLocationConfirmation: false
      },
      UIApplicationSceneManifest: {
        UIApplicationSupportsMultipleScenes: false,
        UISceneConfigurations: {
          UIWindowSceneSessionRoleApplication: [
            {
              UISceneConfigurationName: "Default Configuration",
              UISceneDelegateClassName: "$(PRODUCT_MODULE_NAME).SceneDelegate",
              UISceneStoryboardFile: "Main"
            }
          ]
        }
      }
    });
  });
});