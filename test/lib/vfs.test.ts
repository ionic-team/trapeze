import { VFS } from "../../lib/vfs";

describe('vfs', () => {
  let vfs: VFS;

  beforeEach(() => {
    vfs = new VFS();
  });

  it('should open file', () => {
    vfs.open('f1', {
      thing: 'what'
    });

    expect(vfs.get('f1').getData()).toStrictEqual({
      thing: 'what'
    });
  });

  it('should get all open files', () => {
    vfs.open('f1', {
      thing: 'f1'
    });
    vfs.open('f2', {
      thing: 'f2'
    });
    vfs.open('f3', {
      thing: 'f3'
    });

    expect(vfs.all()).toEqual({
      f1: vfs.get('f1'),
      f2: vfs.get('f2'),
      f3: vfs.get('f3')
    });
  });
});