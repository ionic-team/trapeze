import { XCConfigFile } from '../src';
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
    expect(file.getPairs()).toMatchObject({
      'PRODUCT_NAME': 'testing',
      'PRODUCT_NAME_ORIGINAL': '$(PRODUCT_NAME)',
      'FOO_MyApp': 'MyAppsName',
      'FOO_testing': 'MyAppsNewName',
      'FOO[sdk=macosx*][arch=i386]': 'bar',
      'BAR': '$(FOO_$(PRODUCT_NAME))',
      'KEY': ''
    });
  });

  it('Should modify variables in file 1', async () => {
    file = new XCConfigFile('../common/test/fixtures/test.xcconfig', vfs);
    await file.load();
    file.set({
      'FOO[sdk=macosx*][arch=i386]': 'asdf',
      'PRODUCT_NAME_ORIGINAL': '$(thing)',
      'KEY': 'value',
      'NEW_KEY[sdk=ios]': 'NEW VALUE'
    });
    console.log(file.getDocument());
    expect(file.getDocument()).toBe(`
//
// Config.xcconfig
//

#include "test.xcconfig"

PRODUCT_NAME = testing
PRODUCT_NAME_ORIGINAL = $(thing)// The value of \`PRODUCT_NAME_ORIGINAL\` would seem to be "testing"
                                        // as assigned by the line before in the xcconfig file. The value 
                                        // is "MyApp", because the inheritance takes prescedence 
                                        // over assignment.

// ...

FOO_MyApp = MyAppsName
FOO_testing = MyAppsNewName
FOO[sdk=macosx*][arch=i386] = asdf
BAR = $(FOO_$(PRODUCT_NAME))            // This will also use the value "MyApp" for "PRODUCT_NAME",
                                        // and resolve to be "$(FOO_MyApp)".
KEY = value
NEW_KEY[sdk=ios] = NEW VALUE
`.trim());
  });

  it('Should load xcconfig file 2', async () => {
    file = new XCConfigFile('../common/test/fixtures/test2.xcconfig', vfs);
    await file.load();
    console.log(file.getDocument());

  });

  it('Should generate xcconfig file', async () => {
    file = new XCConfigFile('../common/test/fixtures/test.xcconfig', vfs);
    await file.load();
    const generated = file.generate();
    console.log(generated);

    expect(file.generate()).toBe(`
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
    expect(file.generate()).toBe(`
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
    expect(file.generate()).toBe(`
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