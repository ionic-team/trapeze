import { JsonFile } from '../src/json';
import { VFS } from '../src/vfs';

describe('json file', () => {
  let vfs: VFS;
  let file: JsonFile;

  beforeEach(async () => {
    vfs = new VFS();
    file = new JsonFile('../common/test/fixtures/json-file.json', vfs);
    await file.load();
  });

  it('Should load json file', async () => {
    expect(file.getDocument()).toMatchObject({
      name: 'json',
      favoriteDay: 'Friday, 13th',
      wardrobe: ['mask'],
      info: {
        age: 34,
      },
    });
  });

  it('Should set json', async () => {
    file.set({
      name: 'Jason',
      wardrobe: ['chainsaw'],
      info: {
        size: 'large',
      },
    });
    expect(file.getDocument()).toMatchObject({
      name: 'Jason',
      favoriteDay: 'Friday, 13th',
      wardrobe: ['chainsaw'],
      info: {
        size: 'large',
      },
    });
  });

  it('Should merge json', async () => {
    file.merge({
      wardrobe: ['chainsaw'],
      info: {
        color: 'blue',
      },
    });
    expect(file.getDocument()).toMatchObject({
      name: 'json',
      favoriteDay: 'Friday, 13th',
      wardrobe: ['mask', 'chainsaw'],
      info: {
        age: 34,
        color: 'blue',
      },
    });
  });
});
