import { copy, readFile, writeFile } from '@ionic/utils-fs';
import { rm } from 'fs/promises';
import { join } from 'path';
import { temporaryDirectory } from 'tempy';

import { StringsFile } from '../src';
import { MobileProject } from '../src/project';
import { generateStrings, parseStrings, setStringsEntry } from '../src/util/strings';
import { VFS } from '../src/vfs';

const fixture = '../common/test/fixtures/strings.strings';

describe('strings file', () => {
  let vfs: VFS;
  let file: StringsFile;

  beforeEach(async () => {
    vfs = new VFS();
    file = new StringsFile(fixture, vfs);
    await file.load();
  });

  it('Should load strings file', async () => {
    expect(file.getDocument()).toMatchObject([
      { content: '', startLine: 0, startCol: 0, endLine: 0, endCol: 0 },
      {
        comment: ' Insert Element menu item ',
        startLine: 1,
        startCol: 1,
        endLine: 1,
        endCol: 28
      },
      { content: '\n\n', startLine: 1, startCol: 1, endLine: 3, endCol: 1 },
      {
        key: 'Insert Element',
        value: 'Insert Element',
        startLine: 3,
        startCol: 1,
        endLine: 3,
        endCol: 36
      },
      {
        content: '\n\n',
        startLine: 3,
        startCol: 1,
        endLine: 3,
        endCol: 36
      },
      {
        comment: ' Error string used for unknown error types. ',
        startLine: 5,
        startCol: 1,
        endLine: 5,
        endCol: 46
      },
      { content: '\n\n', startLine: 5, startCol: 1, endLine: 7, endCol: 1 },
      {
        key: 'ErrorString_1',
        value: 'An unknown error occurred.',
        startLine: 7,
        startCol: 1,
        endLine: 7,
        endCol: 47
      },
      { content: '\n\n', startLine: 7, startCol: 1, endLine: 9, endCol: 1 },
      {
        key: 'KeyWithoutComment',
        value: 'This key has no comment',
        startLine: 9,
        startCol: 1,
        endLine: 9,
        endCol: 54
      },
      {
        content: '\n\n',
        startLine: 9,
        startCol: 1,
        endLine: 9,
        endCol: 54
      },
      { comment: '**', startLine: 11, startCol: 1, endLine: 11, endCol: 4 },
      {
        content: '\n\n   ',
        startLine: 11,
        startCol: 1,
        endLine: 13,
        endCol: 4
      },
      {
        key: 'This is a key',
        value: 'This is a value',
        startLine: 13,
        startCol: 4,
        endLine: 13,
        endCol: 39
      }
    ]
   );
  });

  it('Should generate strings file', async () => {
    expect(generateStrings(file.getDocument())).toBe(`
/* Insert Element menu item */

"Insert Element" = "Insert Element";

/* Error string used for unknown error types. */

"ErrorString_1" = "An unknown error occurred.";

"KeyWithoutComment" = "This key has no comment";

/****/

   "This is a key" = "This is a value";
    `.trim());
  });

  it('Should set strings key/value pairs', async () => {
    file.set({
      'Insert Element': 'New1',
      'KeyWithoutComment': 'New2'
    });
    expect(generateStrings(file.getDocument())).toBe(`
/* Insert Element menu item */

"Insert Element" = "New1";

/* Error string used for unknown error types. */

"ErrorString_1" = "An unknown error occurred.";

"KeyWithoutComment" = "New2";

/****/

   "This is a key" = "This is a value";
    `.trim());
  });

  it('Should set new keys', async () => {
    file.set({
      'New key': 'Yes'
    });
    expect(generateStrings(file.getDocument())).toBe(`
/* Insert Element menu item */

"Insert Element" = "Insert Element";

/* Error string used for unknown error types. */

"ErrorString_1" = "An unknown error occurred.";

"KeyWithoutComment" = "This key has no comment";

/****/

   "This is a key" = "This is a value";

"New key" = "Yes";
    `.trim());
  });

  it('Should write the document on commit', async () => {
    const dir = temporaryDirectory();
    const path = join(dir, 'Localizable.strings');
    await copy(fixture, path);

    const tempVfs = new VFS();
    const tempFile = new StringsFile(path, tempVfs);
    await tempFile.load();
    await tempFile.set({ 'Insert Element': 'New1' });

    await tempVfs.commitAll({} as MobileProject);

    const contents = await readFile(path, { encoding: 'utf-8' });
    expect(contents).toContain('"Insert Element" = "New1";');
    expect(contents).toContain('/* Insert Element menu item */');

    await rm(dir, { force: true, recursive: true });
  });

  it('Should not reload a file that is already open', async () => {
    await file.set({ 'Insert Element': 'New1' });
    await file.load();

    expect(generateStrings(file.getDocument())).toContain('"Insert Element" = "New1";');
    expect(Object.keys(vfs.all())).toEqual([fixture]);
  });

  it('Should set from JSON file', async () => {
    await file.setFromJson('../common/test/fixtures/strings.json');
    expect(generateStrings(file.getDocument())).toBe(`
/* Insert Element menu item */

"Insert Element" = "New3";

/* Error string used for unknown error types. */

"ErrorString_1" = "New4";

"KeyWithoutComment" = "This key has no comment";

/****/

   "This is a key" = "This is a value";
    `.trim());
  });

  describe('escaped quotes', () => {
    const escapedFixture = '../common/test/fixtures/strings-escaped.strings';

    beforeEach(async () => {
      vfs = new VFS();
      file = new StringsFile(escapedFixture, vfs);
      await file.load();
    });

    it('Should keep escape sequences and comment markers inside strings', async () => {
      expect(file.getDocument()).toMatchObject([
        { content: '' },
        { comment: ' Camera permission ' },
        { content: '\n' },
        { key: 'NSCameraUsageDescription', value: 'Allow \\"App\\" to use the camera' },
        { content: '\n\n' },
        { key: 'Key with \\"quotes\\"', value: 'Paths like /* or */ are not comments' },
        { content: '\n' },
      ]);
    });

    it('Should regenerate the file unchanged', async () => {
      const contents = await readFile(escapedFixture, { encoding: 'utf-8' });
      expect(generateStrings(file.getDocument())).toBe(contents);
    });

    it('Should set keys before the final line break', async () => {
      file.set({ CFBundleDisplayName: 'My App' });
      expect(generateStrings(file.getDocument())).toBe(`
/* Camera permission */
"NSCameraUsageDescription" = "Allow \\"App\\" to use the camera";

"Key with \\"quotes\\"" = "Paths like /* or */ are not comments";

"CFBundleDisplayName" = "My App";
      `.trim() + '\n');
    });

    it('Should update an existing key that contains quotes', async () => {
      file.set({ 'Key with "quotes"': 'Updated' });
      expect(generateStrings(file.getDocument())).toBe(`
/* Camera permission */
"NSCameraUsageDescription" = "Allow \\"App\\" to use the camera";

"Key with \\"quotes\\"" = "Updated";
      `.trim() + '\n');
    });
  });

  describe('plain text values', () => {
    it('Should escape quotes, backslashes and line breaks', async () => {
      file.set({
        'Say "hi"': 'Say "hi"',
        multiline: 'line1\r\nline2',
        trailingSlash: 'C:\\',
      });

      const generated = generateStrings(file.getDocument());
      expect(generated).toContain('"Say \\"hi\\"" = "Say \\"hi\\"";');
      expect(generated).toContain('"multiline" = "line1\\r\\nline2";');
      expect(generated).toContain('"trailingSlash" = "C:\\\\";');
      expect(generateStrings(parseStrings(generated))).toBe(generated);
    });
  });

  describe('line breaks', () => {
    it('Should keep line breaks inside values and comments', async () => {
      const contents = '/* Class = "UILabel";\n   ObjectID = "abc"; */\n"title" = "line1\nline2";';
      const entries = parseStrings(contents);

      expect(entries).toContainEqual(expect.objectContaining({ comment: ' Class = "UILabel";\n   ObjectID = "abc"; ' }));
      expect(entries).toContainEqual(expect.objectContaining({ key: 'title', value: 'line1\nline2' }));
      expect(generateStrings(entries)).toBe(contents);
    });
  });

  describe('file format', () => {
    it.each([
      ['CRLF line endings', '/* Title */\r\n"title" = "Title";\r\n'],
      ['a final line break', '"title" = "Title";\n'],
      ['an empty key', '"" = "empty";\n"title" = "Title";'],
      ['an empty comment', '/**/\n"title" = "Title";'],
      ['line comments', '// Title of the app\n"title" = "Title"; // after an entry\n// at the end'],
      ['line comments in a CRLF file', '// Title of the app\r\n"title" = "Title";\r\n'],
      ['comment markers inside a line comment', '// see /* and */\n"title" = "Title";'],
      ['whitespace after a block comment', '/* Title */\n\n'],
      ['comment markers inside a block comment', '/* a /* b // c */\n"title" = "Title";'],
      ['a block comment at the end', '"title" = "Title";\n/* end */'],
    ])('Should regenerate a file with %s unchanged', async (_, contents) => {
      expect(generateStrings(parseStrings(contents))).toBe(contents);
    });

    it('Should not accept a comment end outside a comment', async () => {
      expect(() => parseStrings('"a" = "b"; */')).toThrow('unknown character');
    });

    it.each([
      ['a missing final semicolon', '"a" = "b";\n"c" = "d"\n', '2:1'],
      ['an unclosed string', '"a" = "b";\n"c" = "d\n', '2:1'],
      ['a key without a value', '"a" = "b";\n"c"\n', '2:1'],
      ['an unclosed comment', '"a" = "b";\n/* open\n"c" = "d";', '2:1'],
      ['an indented unfinished entry', '"a" = "b";\n   "c" = "d"', '2:4'],
    ])('Should throw at the end of a file with %s', async (_, contents, start) => {
      expect(() => parseStrings(contents)).toThrow(`unexpected end of file in the entry or comment that starts at ${start}`);
    });

    it('Should not load a file with an unfinished entry', async () => {
      const dir = temporaryDirectory();
      onTestFinished(() => rm(dir, { force: true, recursive: true }));
      const path = join(dir, 'Localizable.strings');
      await writeFile(path, '"a" = "b";\n"c" = "d"\n');

      await expect(new StringsFile(path, new VFS()).load()).rejects.toThrow('unexpected end of file');
    });

    it('Should update an empty key', async () => {
      const entries = setStringsEntry(parseStrings('"" = "b";'), { key: '', value: 'z' });
      expect(generateStrings(entries)).toBe('"" = "z";');
    });

    it('Should commit a CRLF file with its line endings', async () => {
      const dir = temporaryDirectory();
      onTestFinished(() => rm(dir, { force: true, recursive: true }));
      const path = join(dir, 'Localizable.strings');
      await writeFile(path, '/* Title */\r\n"title" = "Title";\r\n');

      const crlfVfs = new VFS();
      const crlfFile = new StringsFile(path, crlfVfs);
      await crlfFile.load();
      await crlfFile.set({ title: 'New title', subtitle: 'Subtitle' });
      await crlfVfs.commitAll({} as MobileProject);

      expect(await readFile(path, { encoding: 'utf-8' })).toBe(
        '/* Title */\r\n"title" = "New title";\r\n\r\n"subtitle" = "Subtitle";\r\n'
      );
    });

    it('Should read line comments', async () => {
      expect(parseStrings('// Title of the app\n"title" = "Title";')).toMatchObject([
        { content: '' },
        { lineComment: ' Title of the app' },
        { content: '\n' },
        { key: 'title', value: 'Title' },
      ]);
    });

    it('Should set new keys with the line ending of the file', async () => {
      const entries = setStringsEntry(parseStrings('"a" = "b";\r\n'), { key: 'c', value: 'd' });
      expect(generateStrings(entries)).toBe('"a" = "b";\r\n\r\n"c" = "d";\r\n');
    });

    it('Should keep one final line break when setting several new keys', async () => {
      const once = setStringsEntry(parseStrings('"a" = "b";\n'), { key: 'c', value: 'd' });
      const twice = setStringsEntry(once, { key: 'e', value: 'f' });
      expect(generateStrings(twice)).toBe('"a" = "b";\n\n"c" = "d";\n\n"e" = "f";\n');
    });

    it('Should set new keys after a line comment at the end of the file', async () => {
      const entries = setStringsEntry(parseStrings('"a" = "b";\n// end\n'), { key: 'c', value: 'd' });
      expect(generateStrings(entries)).toBe('"a" = "b";\n// end\n\n"c" = "d";\n');
    });

    it('Should set the first key of an empty file without a separator', async () => {
      expect(generateStrings(setStringsEntry([], { key: 'a', value: 'b' }))).toBe('"a" = "b";');
    });
  });
});
