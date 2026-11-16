import { readFile } from '@ionic/utils-fs';

import { PropertiesFile } from '../src/properties';
import { generateProperties, parseProperties, setProperty, toPropertiesObject } from '../src/util/properties';
import { VFS } from '../src/vfs';

describe('Android: properties files', () => {
  let vfs: VFS;
  let file: PropertiesFile;

  beforeEach(async () => {
    vfs = new VFS();
    file = new PropertiesFile('../common/test/fixtures/ios-and-android/android/gradle.properties', vfs);
    await file.load();
  });

  it('Should load properties file', async () => {
    expect(file.getProperties()).toMatchObject({
      'org.gradle.jvmargs': '-Xmx1536m',
      'android.useAndroidX': 'true',
      'android.enableJetifier': 'true'
    });
  });

  it('Should update properties file', async () => {
    expect(file.updateProperties({
      'org.gradle.jvmargs': 'fake'
    }));
    expect(file.getProperties()).toMatchObject({
      'org.gradle.jvmargs': 'fake',
      'android.useAndroidX': 'true',
      'android.enableJetifier': 'true'
    });
  });

  describe('Java rules', () => {
    const fixture = '../common/test/fixtures/java-rules.properties';

    beforeEach(async () => {
      vfs = new VFS();
      file = new PropertiesFile(fixture, vfs);
      await file.load();
    });

    it('Should read entries like java.util.Properties', async () => {
      expect(file.getProperties()).toEqual({
        'org.gradle.jvmargs': '-Xmx2048m -Dfile.encoding=UTF-8',
        url: 'https://example.com/a?b=c#frag',
        semi: 'a;b',
        'win.path': 'C:\\Users\\dev',
        'colon.key': 'colonvalue',
        'spaced.key': 'spaced value',
        multi: 'first second',
        unicode: 'café',
        'android.useAndroidX': 'true',
      });
    });

    it('Should regenerate the file unchanged', async () => {
      const contents = await readFile(fixture, { encoding: 'utf-8' });
      expect(file.generate()).toBe(contents);
    });

    it('Should only rewrite the lines it changes', async () => {
      await file.updateProperties({
        'org.gradle.jvmargs': '-Xmx4096m -Dfile.encoding=UTF-8',
        'android.enableJetifier': true,
      });

      const contents = await readFile(fixture, { encoding: 'utf-8' });
      expect(file.generate()).toBe(
        contents.replace('-Xmx2048m', '-Xmx4096m') + 'android.enableJetifier=true\n'
      );
    });
  });

  describe('reading entries', () => {
    const read = (contents: string) => toPropertiesObject(parseProperties(contents));

    it('Should only continue a line on an odd number of trailing backslashes', async () => {
      expect(read('a=1\\\\\nb=2\n')).toEqual({ a: '1\\', b: '2' });
      expect(read('a=1\\\\\\\nb=2\n')).toEqual({ a: '1\\b=2' });
    });

    it('Should read a continued line that starts with a comment character as part of the value', async () => {
      expect(read('a=1\\\n#b\n')).toEqual({ a: '1#b' });
    });

    it('Should never continue a comment line', async () => {
      expect(read('# note \\\nb=2\n')).toEqual({ b: '2' });
      expect(read('\\\n#comment\nb=2\n')).toEqual({ b: '2' });
    });
  });

  describe('writing entries', () => {
    it('Should keep the line of an entry that already has the value', async () => {
      const lines = setProperty(parseProperties('a : 1\n'), { key: 'a', value: '1' });

      expect(generateProperties(lines)).toBe('a : 1\n');
    });

    it('Should not append an entry to a continued last line', async () => {
      const lines = setProperty(parseProperties('a=1\\'), { key: 'c', value: '3' });

      expect(generateProperties(lines)).toBe('a=1\\\n\nc=3\n');
      expect(toPropertiesObject(parseProperties(generateProperties(lines)))).toEqual({ a: '1', c: '3' });
    });

    it('Should escape keys and values that Java would read differently', async () => {
      const lines = setProperty([], { key: '#key with = and :', value: ' C:\\dir\nnext line' });

      expect(generateProperties(lines)).toBe('\\#key\\ with\\ \\=\\ and\\ \\:=\\ C:\\\\dir\\nnext line\n');
      expect(parseProperties(generateProperties(lines))).toEqual(lines);
    });

    it('Should update every entry with the same key', async () => {
      const lines = setProperty(parseProperties('a=1\nb=2\na=3\n'), { key: 'a', value: '4' });

      expect(generateProperties(lines)).toBe('a=4\nb=2\na=4\n');
    });

    it('Should append new entries on their own line with the line ending of the file', async () => {
      const lines = setProperty(parseProperties('a=1\r\nb=2'), { key: 'c', value: '3' });

      expect(generateProperties(lines)).toBe('a=1\r\nb=2\r\nc=3\r\n');
    });
  });
});
