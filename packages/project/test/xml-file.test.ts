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
});
