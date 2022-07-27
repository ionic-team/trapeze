import { XmlFile } from '../src';
import { formatXml, serializeXml } from '../src/util/xml';
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

  it('Should delete nodes', async () => {
    const node = file.find('string');

    file.deleteNodes('//string');
    const doc = file.getDocumentElement();

    const serialized = serializeXml(doc).replaceAll(/\s+/g, '');
    expect(serialized).toBe(`
<resources></resources>
    `.trim());
  });


  it('Should add attributes', async () => {
    file.setAttrs('/resources', {
      test: 'thing'
    });
    const doc = file.getDocumentElement();
    const serialized = serializeXml(doc);
    expect(serialized).toBe(`
<resources test="thing">
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

  it('Should delete and replace root', async () => {
    file.deleteNodes('/resources');
    file.injectFragment('/', `<tag><thing/></tag>`);
    const doc = file.getDocumentElement();
    const serialized = serializeXml(doc);
    expect(serialized).toBe(`<tag><thing/></tag>`);
  });

  it('Should inject', async () => {
    const doc = file.getDocumentElement();
    const node = file.find('resources');
    file.injectFragment('resources', `
    <string name="app_name">$PRODUCT_NAME</string>
    <string name="title_activity_main">$PRODUCT_NAME</string>
    <string name="package_name">$ANDROID_PACKAGE_NAME</string>
    <string name="custom_url_scheme">$ANDROID_PACKAGE_NAME</string>
    `.trim());
    const serialized = await formatXml(doc);
    expect(serialized.trim()).toBe(`
<resources>
    <string name="app_name">capacitor-configure-test</string>
    <string name="title_activity_main">capacitor-configure-test</string>
    <string name="package_name">io.ionic.starter</string>
    <string name="custom_url_scheme">io.ionic.starter</string>
    <string name="app_name">$PRODUCT_NAME</string>
    <string name="title_activity_main">$PRODUCT_NAME</string>
    <string name="package_name">$ANDROID_PACKAGE_NAME</string>
    <string name="custom_url_scheme">$ANDROID_PACKAGE_NAME</string>
</resources>
    `.trim());
  });

  it('Should merge simple tree', async () => {
    file.mergeFragment('/resources', `
    <resources>
      <string name="app_name">$PRODUCT_NAME</string>
      <string name="title_activity_main">$PRODUCT_NAME</string>
      <string name="package_name">$ANDROID_PACKAGE_NAME</string>
      <string name="custom_url_scheme">$ANDROID_PACKAGE_NAME</string>
    </resources>
    `.trim());

    const doc = file.getDocumentElement();
    const serialized = await formatXml(doc);
    expect(serialized.trim()).toBe(`
<resources>
    <string name="app_name">$PRODUCT_NAME</string>
    <string name="title_activity_main">$PRODUCT_NAME</string>
    <string name="package_name">$ANDROID_PACKAGE_NAME</string>
    <string name="custom_url_scheme">$ANDROID_PACKAGE_NAME</string>
</resources>
    `.trim());
  });

  it('Should merge complex tree', async () => {
    await file.mergeFragment('/resources', `
    <resources>
      <string name="app_name">$PRODUCT_NAME</string>
      <string name="title_activity_main">$PRODUCT_NAME</string>
      <thing>
        <another-thing name="this">thing</another-thing>
      </thing>
    </resources>
    `.trim());

    const doc = file.getDocumentElement();
    const serialized = await formatXml(doc);
    expect(serialized.trim()).toBe(`
<resources>
    <string name="app_name">$PRODUCT_NAME</string>
    <string name="title_activity_main">$PRODUCT_NAME</string>
    <string name="package_name">io.ionic.starter</string>
    <string name="custom_url_scheme">io.ionic.starter</string>
    <thing>
        <another-thing name="this">thing</another-thing>
    </thing>
</resources>
    `.trim());
  });

  it('Should merge insert simple tree', async () => {
    await file.mergeFragment('/resources', `
    <resources>
      <thing>
        <this />
      </thing>
    </resources>
    `.trim());

    const doc = file.getDocumentElement();
    const serialized = await formatXml(doc);
    expect(serialized.trim()).toBe(`
<resources>
    <string name="app_name">capacitor-configure-test</string>
    <string name="title_activity_main">capacitor-configure-test</string>
    <string name="package_name">io.ionic.starter</string>
    <string name="custom_url_scheme">io.ionic.starter</string>
    <thing>
        <this />
    </thing>
</resources>
    `.trim());
  });

  it('Should replace', async () => {
    file.replaceFragment('resources/string[@name="app_name"]', `
      <string name="app_name">$PRODUCT_NAME</string>
    `);

    const doc = file.getDocumentElement();

    const serialized = serializeXml(doc);
    expect(serialized.trim()).toBe(`
<resources>
    <string name="app_name">$PRODUCT_NAME</string>
    <string name="title_activity_main">capacitor-configure-test</string>
    <string name="package_name">io.ionic.starter</string>
    <string name="custom_url_scheme">io.ionic.starter</string>
</resources>`.trim());
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
