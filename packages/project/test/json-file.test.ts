import { copy, readFile } from '@ionic/utils-fs';
import { rm } from 'fs/promises';
import { join } from 'path';
import { temporaryDirectory } from 'tempy';

import { JsonFile } from '../src/json';
import { MobileProject } from '../src/project';
import { VFS } from '../src/vfs';

const fixture = '../common/test/fixtures/json-file.json';

describe('json file', () => {
  let vfs: VFS;
  let file: JsonFile;

  beforeEach(async () => {
    vfs = new VFS();
    file = new JsonFile(fixture, vfs);
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

  it('Should write the document on commit', async () => {
    const dir = temporaryDirectory();
    const path = join(dir, 'json-file.json');
    await copy(fixture, path);

    const tempVfs = new VFS();
    const tempFile = new JsonFile(path, tempVfs);
    await tempFile.load();
    await tempFile.merge({ info: { color: 'blue' } });

    await tempVfs.commitAll({} as MobileProject);

    const contents = await readFile(path, { encoding: 'utf-8' });
    expect(JSON.parse(contents)).toMatchObject({
      name: 'json',
      info: { age: 34, color: 'blue' },
    });
    expect(contents).toContain('\n  "name": "json"');

    await rm(dir, { force: true, recursive: true });
  });

  it('Should not reload a file that is already open', async () => {
    await file.set({ name: 'Jason' });
    await file.load();

    expect(file.getDocument()).toMatchObject({ name: 'Jason' });
    expect(Object.keys(vfs.all())).toEqual([fixture]);
  });
});
