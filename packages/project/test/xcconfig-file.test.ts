import { XCConfigFile } from '../src';
import { generateXCConfig } from '../src/parse/xcconfig';
import { VFS } from '../src/vfs';

describe('strings file', () => {
  let vfs: VFS;
  let file: XCConfigFile;

  beforeEach(async () => {
    vfs = new VFS();
  });

  it('Should load xcconfig file 1', async () => {
    file = new XCConfigFile('../common/test/fixtures/test.xcconfig', vfs);
    await file.load();
    console.log(file.getDocument());
    expect(file.getDocument()).toMatchObject(
          [
      { comment: '' },
      { comment: ' Config.xcconfig' },
      { comment: '' },
      { content: '\n', value: '' },
      { include: 'test.xcconfig' },
      { content: '\n', value: '' },
      { content: '\n', value: '' },
      { key: 'PRODUCT_NAME', value: 'testing' },
      { key: 'PRODUCT_NAME_ORIGINAL', value: '$(PRODUCT_NAME)' },
      { content: '   ' },
      {
        comment: ' The value of `PRODUCT_NAME_ORIGINAL` would seem to be "testing"'
      },
      { content: '                                        ' },
      {
        comment: ' as assigned by the line before in the xcconfig file. The value '
      },
      { content: '                                        ' },
      {
        comment: ' is "MyApp", because the inheritance takes prescedence '
      },
      { content: '                                        ' },
      { comment: ' over assignment.' },
      { content: '\n', value: '' },
      { comment: ' ...' },
      { content: '\n', value: '' },
      { key: 'FOO_MyApp', value: 'MyAppsName' },
      { key: 'FOO_testing', value: 'MyAppsNewName' },
      { key: 'FOO[sdk=macosx*][arch=i386]', value: 'bar' },
      { key: 'BAR', value: '$(FOO_$(PRODUCT_NAME))' },
      { content: '              ' },
      {
        comment: ' This will also use the value "MyApp" for "PRODUCT_NAME",'
      },
      { content: '                                        ' },
      { comment: ' and resolve to be "$(FOO_MyApp)".' }
    ]
    );
  });

  it('Should load xcconfig file 2', async () => {
    file = new XCConfigFile('../common/test/fixtures/test2.xcconfig', vfs);
    await file.load();
    console.log(file.getDocument());

    expect(file.getDocument()).toMatchObject([
      { comment: '' },
      { content: '\n' },
      {
        comment: ' This file defines additional configuration options that are appropriate only'
      },
      { content: '\n' },
      {
        comment: ' for watchOS. This file is not standalone -- it is meant to be included into'
      },
      { content: '\n' },
      { comment: ' a configuration file for a specific type of target.' },
      { content: '\n' },
      { comment: '' },
      { content: '\n' },
      { content: '\n' },
      { include: 'thing.xcconfig' },
      { content: '\n' },
      { content: '\n' },
      { comment: ' Where to find embedded frameworks' },
      { content: '\n' },
      {
        key: 'LD_RUNPATH_SEARCH_PATHS',
        value: '$(inherited) @executable_path/Frameworks @loader_path/Frameworks'
      },
      { content: '\n' },
      { content: '\n' },
      {
        comment: ' The base SDK to use (if no version is specified, the latest version is'
      },
      { content: '\n' },
      { comment: ' assumed)' },
      { content: '\n' },
      { key: 'SDKROOT', value: 'watchos' },
      { content: '\n' },
      { content: '\n' },
      { comment: ' Supported device families' },
      { content: '\n' },
      { key: 'TARGETED_DEVICE_FAMILY', value: '4' },
      { content: '\n' },
      { content: '\n' },
      { key: 'KEY_ONLY', value: '' },
      { content: '\n' },
      { content: '\n' },
      { key: 'FOO[sdk=<sdk>][arch=<arch>]', value: 'asdf' }
    ]);
  });

  it('Should generate xcconfig file', async () => {
    file = new XCConfigFile('../common/test/fixtures/test.xcconfig', vfs);
    await file.load();
    const generated = generateXCConfig(file.getDocument());
    console.log(generated);

    expect(generateXCConfig(file.getDocument())).toBe(`
//
// Config.xcconfig
//

#include "test.xcconfig"

PRODUCT_NAME = testing
PRODUCT_NAME_ORIGINAL = $(PRODUCT_NAME) // The value of \`PRODUCT_NAME_ORIGINAL\` would seem to be "testing"
                                        // as assigned by the line before in the xcconfig file. The value 
                                        // is "MyApp", because the inheritance takes prescedence 
                                        // over assignment.

// ...

FOO_MyApp = MyAppsName
FOO_testing = MyAppsNewName
FOO[sdk=macosx*][arch=i386] = bar
BAR = $(FOO_$(PRODUCT_NAME))            // This will also use the value "MyApp" for "PRODUCT_NAME",
                                        // and resolve to be "$(FOO_MyApp)".
    `.trim());
  });

  it('Should set strings key/value pairs', async () => {
    file = new XCConfigFile('../common/test/fixtures/test.xcconfig', vfs);
    await file.load();
    file.set({
      'Insert Element': 'New1',
      'KeyWithoutComment': 'New2'
    });
    expect(generateXCConfig(file.getDocument())).toBe(`
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
    file = new XCConfigFile('../common/test/fixtures/test.xcconfig', vfs);
    await file.load();
    file.set({
      'New key': 'Yes'
    });
    expect(generateXCConfig(file.getDocument())).toBe(`
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
});