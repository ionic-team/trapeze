import { MobileProject } from "../src/project";
import { VFS, VFSFile } from "../src/vfs";

describe('vfs', () => {
  let vfs: VFS;

  beforeEach(() => {
    vfs = new VFS();
  });

  it('should open file', () => {
    vfs.open('f1', {
      thing: 'what'
    }, async () => { });

    expect(vfs.get('f1')?.getData()).toStrictEqual({
      thing: 'what'
    });
  });

  it('should get all open files', () => {
    vfs.open('f1', {
      thing: 'f1'
    }, async () => { });
    vfs.open('f2', {
      thing: 'f2'
    }, async () => { });
    vfs.open('f3', {
      thing: 'f3'
    }, async () => { });

    expect(vfs.all()).toEqual({
      f1: vfs.get('f1'),
      f2: vfs.get('f2'),
      f3: vfs.get('f3')
    });
  });

  it('should only commit modified files', async () => {
    const committed: string[] = [];
    const commitFn = async (file: VFSFile) => {
      committed.push(file.getFilename());
    };

    vfs.open('f1', { thing: 'f1' }, commitFn);
    vfs.open('f2', { thing: 'f2' }, commitFn);
    vfs.open('f3', { thing: 'f3' }, commitFn);

    vfs.markModified('f2');
    vfs.set('f3', { thing: 'f3 updated' });

    expect(vfs.modifiedFiles().map(f => f.getFilename())).toEqual(['f2', 'f3']);

    await vfs.commitAll({} as MobileProject);

    expect(committed).toEqual(['f2', 'f3']);
  });

  it('should only diff modified files', async () => {
    const diffFn = async () => ({ old: 'a', new: 'b' });

    vfs.open('f1', { thing: 'f1' }, async () => {}, diffFn);
    vfs.open('f2', { thing: 'f2' }, async () => {}, diffFn);

    vfs.markModified('f2');

    const diffs = await vfs.diffAll();

    expect(diffs.map(d => d.file?.getFilename())).toEqual(['f2']);
    expect(diffs[0].patch).toContain('-a');
    expect(diffs[0].patch).toContain('+b');
  });

  it('should skip files that cannot be diffed', async () => {
    vfs.open('f1', { thing: 'f1' }, async () => {}, async () => {
      throw new Error('cannot diff this');
    });
    vfs.open('f2', { thing: 'f2' }, async () => {}, async () => ({ old: 'a', new: 'b' }));

    vfs.markModified('f1');
    vfs.markModified('f2');

    const diffs = await vfs.diffAll();

    expect(diffs.map(d => d.file?.getFilename())).toEqual(['f2']);
  });
});