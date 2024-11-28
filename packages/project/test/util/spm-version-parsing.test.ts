import { classifyVersion } from '../../src/ios/spm';

describe.only('SPM versions', () => {
  it('should classify SPM versions', () => {
    expect(classifyVersion('1.0.0')).toEqual({
      kind: 'exactVersion',
      version: '1.0.0',
    });
    expect(classifyVersion('^1.0.0')).toEqual({
      kind: 'upToNextMajorVersion',
      minimumVersion: '1.0.0',
    });
    expect(classifyVersion('~1.0.0')).toEqual({
      kind: 'upToNextMinorVersion',
      minimumVersion: '1.0.0',
    });
    expect(classifyVersion('>=1.0.0 <2.0.0')).toEqual({
      kind: 'versionRange',
      minimumVersion: '1.0.0',
      maximumVersion: '2.0.0',
    });
    expect(classifyVersion('>=2.0.0')).toEqual({
      kind: 'upToNextMajorVersion',
      minimumVersion: '2.0.0',
    });
    expect(classifyVersion('#abcdefghijklmnopqrstuvwxyz')).toEqual({
      kind: 'revision',
      revision: 'abcdefghijklmnopqrstuvwxyz',
    });
    expect(classifyVersion('asd')).toEqual({
      kind: 'branch',
      branch: 'asd',
    });
  });
});
