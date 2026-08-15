import { copy, readFile, rm } from '@ionic/utils-fs';
import { join } from 'path';
import { temporaryDirectory } from 'tempy';

import { PlistFile } from '../src/plist';
import { MobileProject } from '../src/project';
import { serializeXml } from '../src/util/xml';
import { VFS } from '../src/vfs';

const fixture = '../common/test/fixtures/ios-and-android/ios/App/My App Clip/AppClip.plist';

describe('plist file', () => {
  let vfs: VFS;
  let file: PlistFile;

  beforeEach(async () => {
    vfs = new VFS();
    file = new PlistFile(fixture, vfs);
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
  it('Should set from plist xml string #105', async () => {
    file.setFromXml(`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>NSFoo</key>
  <dict>
    <key>Bar</key>
    <true/>
  </dict>
</dict>
</plist>
    `);
    const doc = file.getDocument();
    expect(doc).toMatchObject({
      NSFoo: {
        Bar: true
      }
    });
  });

  it('Should write the document on commit', async () => {
    const dir = temporaryDirectory();
    const path = join(dir, 'AppClip.plist');
    await copy(fixture, path);

    const tempVfs = new VFS();
    const tempFile = new PlistFile(path, tempVfs);
    await tempFile.load();
    await tempFile.merge({ NSFaceIDUsageDescription: 'Log in' });

    await tempVfs.commitAll({} as MobileProject);

    const contents = await readFile(path, { encoding: 'utf-8' });
    // Xcode indents plists with tabs
    expect(contents).toContain('\n\t<dict>');

    const reloaded = new PlistFile(path, new VFS());
    await reloaded.load();
    expect(reloaded.getDocument()).toMatchObject({
      NSFaceIDUsageDescription: 'Log in',
      NSAppClip: {
        NSAppClipRequestEphemeralUserNotification: false
      }
    });

    await rm(dir, { force: true, recursive: true });
  });

  it('Should not reload a file that is already open', async () => {
    await file.set({ NSFaceIDUsageDescription: 'Log in' });
    await file.load();

    expect(file.getDocument()).toMatchObject({ NSFaceIDUsageDescription: 'Log in' });
    expect(Object.keys(vfs.all())).toEqual([fixture]);
  });
});