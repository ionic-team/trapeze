import { PropertiesFile } from '../src/android/properties';
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
      'android.useAndroidX': true,
      'android.enableJetifier': true
    });
  });

  it('Should update properties file', async () => {
    expect(file.updateProperties({
      'org.gradle.jvmargs': 'fake'
    }));
    expect(file.getProperties()).toMatchObject({
      'org.gradle.jvmargs': 'fake',
      'android.useAndroidX': true,
      'android.enableJetifier': true
    });
  });
});
