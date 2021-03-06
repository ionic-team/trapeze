import { XmlFile } from '../src';
import { serializeXml } from '../src/util/xml';
import { VFS } from '../src/vfs';

describe('xml file', () => {
  let vfs: VFS;
  let file: XmlFile;

  beforeEach(async () => {
    vfs = new VFS();
    file = new XmlFile('../common/test/fixtures/ios-and-android/android/app/src/main/res/values/strings.xml', vfs);
    await file.load();
  });

  it('Should load xml file', async () => {
    const doc = file.getDocumentElement();
    const serialized = serializeXml(doc);
    expect(serialized).toBe(`
<resources>
    <string name="app_name">capacitor-configure-test</string>
    <string name="title_activity_main">capacitor-configure-test</string>
    <string name="package_name">io.ionic.starter</string>
    <string name="custom_url_scheme">io.ionic.starter</string>
</resources>
    `.trim());
  });

  it('Should delete attributes', async () => {
    file.deleteAttributes('//string', ['name']);
    const doc = file.getDocumentElement();
    const serialized = serializeXml(doc);
    expect(serialized).toBe(`
<resources>
    <string>capacitor-configure-test</string>
    <string>capacitor-configure-test</string>
    <string>io.ionic.starter</string>
    <string>io.ionic.starter</string>
</resources>
    `.trim());
  });

  describe('GitHub Issue Tests', () => {
    // https://github.com/ionic-team/trapeze/issues/80
    it('Should support namespaced queries #80', async () => {
      vfs = new VFS();
      file = new XmlFile('../common/test/fixtures/issues/80/AndroidManifest.xml', vfs);
      await file.load();

      const target = 'manifest/application/receiver[@android:name="nl.xservices.plugins.ShareChooserPendingIntent"]';

      const node = file.find(target);

      expect(node).toBeDefined();
    });
  });
});
