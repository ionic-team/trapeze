import { compare } from '../../src/util/gradle-versions';

describe('Gradle versions', () => {
  it('should compare two gradle versions', () => {
    expect(compare('1.5.2', '1.6.2')).toBe(-1);
    expect(compare('1.8.2', '1.6.2')).toBe(1);
    expect(compare('[1.0,)', '[1.2,)')).toBe(-1);
    expect(compare('1.8.2-beta1-SNAPSHOT', '1.8.2')).toBe(1);
    expect(compare('1.8.2-beta1', '1.8.2-beta1')).toBe(0);
  });
});