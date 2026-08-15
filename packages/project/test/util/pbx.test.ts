import { pbxReadString, pbxSerializeString } from '../../src/util/pbx';

describe('pbx serialization', () => {
  it('should leave values Xcode writes unquoted alone', () => {
    expect(pbxSerializeString('App')).toBe('App');
    expect(pbxSerializeString('io.ionic.starter')).toBe('io.ionic.starter');
    expect(pbxSerializeString('App/Info.plist')).toBe('App/Info.plist');
    expect(pbxSerializeString('1.4.5')).toBe('1.4.5');
  });

  it('should quote values that would otherwise break the pbxproj', () => {
    expect(pbxSerializeString('My App')).toBe('"My App"');
    expect(pbxSerializeString('Acme,Inc')).toBe('"Acme,Inc"');
    expect(pbxSerializeString('Alkalmazás')).toBe('"Alkalmazás"');
    expect(pbxSerializeString('App;')).toBe('"App;"');
    expect(pbxSerializeString('')).toBe('""');
  });

  it('should escape backslashes and double quotes inside a quoted value', () => {
    expect(pbxSerializeString('My "App"')).toBe('"My \\"App\\""');
    expect(pbxSerializeString('back\\slash')).toBe('"back\\\\slash"');
    expect(pbxSerializeString('escaped \\" already')).toBe('"escaped \\\\\\" already"');
  });
});

describe('pbx reading', () => {
  it('should leave unquoted values alone', () => {
    expect(pbxReadString('App')).toBe('App');
    expect(pbxReadString('io.ionic.starter')).toBe('io.ionic.starter');
    expect(pbxReadString(undefined as any)).toBe(undefined);
  });

  it('should unquote and unescape what pbxSerializeString wrote', () => {
    for (const value of ['My App', 'My "App"', 'back\\slash', 'escaped \\" already', '']) {
      expect(pbxReadString(pbxSerializeString(value))).toBe(value);
    }
  });
});
