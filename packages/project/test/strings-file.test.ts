import { StringsFile } from '../src';
import { VFS } from '../src/vfs';

describe('strings file', () => {
  let vfs: VFS;
  let file: StringsFile;

  beforeEach(async () => {
    vfs = new VFS();
    file = new StringsFile('../common/test/fixtures/strings.strings', vfs);
    await file.load();
  });

  it('Should load strings file', async () => {
    /*
    expect(file.getDocument()).toMatchObject({
      name: 'json',
      favoriteDay: 'Friday, 13th',
      wardrobe: ['mask'],
      info: {
        age: 34,
      },
    });
    */
  });
});