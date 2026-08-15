import { pbxSerializeString } from '../../src/util/pbx';

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
});
