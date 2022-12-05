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
    expect(file.getDocument()).toBe(`
//
// Config.xcconfig
//

#include "test.xcconfig"

PRODUCT_NAME = testing
PRODUCT_NAME_ORIGINAL = $(thing) // The value of \`PRODUCT_NAME_ORIGINAL\` would seem to be "testing"
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
    expect(file.getPairs()).toMatchObject({
      'LD_RUNPATH_SEARCH_PATHS': '$(inherited) @executable_path/Frameworks @loader_path/Frameworks',
      'SDKROOT': 'watchos',
      'TARGETED_DEVICE_FAMILY': '4',
      'KEY_ONLY': '',
      'FOO[sdk=<sdk>][arch=<arch>]': 'asdf',
    });
  });

  it('Should modify variables in file 2', async () => {
    file = new XCConfigFile('../common/test/fixtures/test2.xcconfig', vfs);
    await file.load();
    file.set({
      'FOO[sdk=<sdk>][arch=<arch>]': 'new',
      'KEY_ONLY': 'VALUE_ONLY',
      'SDKROOT': '$(inherited) @executable_path/Frameworks @loader_path/Frameworks',
      'LD_RUNPATH_SEARCH_PATHS': ''
    });
    expect(file.getDocument()).toBe(`
//
// This file defines additional configuration options that are appropriate only
// for watchOS. This file is not standalone -- it is meant to be included into
// a configuration file for a specific type of target.
//

#include"thing.xcconfig"

// Where to find embedded frameworks
LD_RUNPATH_SEARCH_PATHS = 

// The base SDK to use (if no version is specified, the latest version is
// assumed)
SDKROOT = $(inherited) @executable_path/Frameworks @loader_path/Frameworks

// Supported device families
TARGETED_DEVICE_FAMILY = 4;
KEY_ONLY = VALUE_ONLY
FOO[sdk=<sdk>][arch=<arch>] = new
    `.trim());
  });
});