import { join } from 'path';
import { copy, readFile, rm } from '@ionic/utils-fs';
import { temporaryDirectory } from 'tempy';

import { Logger, XmlFile } from '../src';
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

    const serialized = serializeXml(doc).replace(/\s+/g, '');
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

  it('Should warn when a target matches no nodes', async () => {
    const warn = vi.spyOn(Logger, 'warn').mockImplementation(() => undefined);
    onTestFinished(() => warn.mockRestore());

    file.setAttrs('missing', { test: 'thing' });

    expect(warn).toHaveBeenCalledWith(expect.stringContaining(`match the target 'missing'`));
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

  // The XML formatter must never re-space text nodes: doing so silently rewrites values
  // such as URLs with query parameters in every XML file Trapeze commits
  describe('Entities in element text', () => {
    let dir: string;
    let path: string;

    beforeEach(async () => {
      dir = temporaryDirectory();
      path = join(dir, 'strings.xml');
      await copy('../common/test/fixtures/xml-entities.xml', path);

      vfs = new VFS();
      file = new XmlFile(path, vfs);
      await file.load();
    });

    afterEach(async () => {
      await rm(dir, { force: true, recursive: true });
    });

    it('Should survive an unrelated change and a commit unmodified', async () => {
      file.setAttrs('/resources', { 'xmlns:tools': 'http://schemas.android.com/tools' });

      const ref = vfs.get(path);
      expect(ref).toBeDefined();
      await ref!.commit();

      const committed = await readFile(path, { encoding: 'utf-8' });
      expect(committed).toContain(`<string name="deep_link">https://example.com/?a=1&amp;b=2</string>`);
      expect(committed).toContain(`<string name="company">Smith &amp; Sons</string>`);
      expect(committed).toContain(`<string name="comparison">a &lt; b &gt; c</string>`);
    });
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

    // https://github.com/ionic-team/trapeze/issues/190
    describe('Should support documents with a default namespace #190', () => {
      beforeEach(async () => {
        vfs = new VFS();
        file = new XmlFile('../common/test/fixtures/issues/190/config.xml', vfs);
        await file.load();
      });

      it('Should find unprefixed targets', async () => {
        expect(file.find('widget')).toHaveLength(1);
        expect(file.find('//widget')).toHaveLength(1);
        expect(file.find('/widget/allow-navigation')).toHaveLength(1);
        expect(file.find(`//allow-navigation[@href='https://*/*']`)).toHaveLength(1);
      });

      it('Should find prefixed targets', async () => {
        expect(file.find('/widget/cdv:plugin')).toHaveLength(1);
      });

      it('Should find targets using the local-name() workaround', async () => {
        expect(file.find(`//*[local-name()='widget']`)).toHaveLength(1);
      });

      it('Should set attributes on an unprefixed target', async () => {
        file.setAttrs('widget', { version: '7.8.9' });

        const doc = file.getDocumentElement();
        expect(doc?.getAttribute('version')).toBe('7.8.9');
      });

      it('Should inject into an unprefixed target', async () => {
        file.injectFragment('widget', `<allow-navigation href="http://*/*" />`);

        const serialized = await formatXml(file.getDocumentElement());
        expect(serialized).toContain(`<allow-navigation href="http://*/*" />`);
        // The injected node inherits the default namespace, so it is selectable too
        expect(file.find('/widget/allow-navigation')).toHaveLength(2);
      });

      it('Should delete an unprefixed target', async () => {
        file.deleteNodes('/widget/allow-navigation');

        const serialized = await formatXml(file.getDocumentElement());
        expect(serialized).not.toContain('allow-navigation');
      });
    });
  });
});
