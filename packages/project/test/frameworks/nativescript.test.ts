import { NativeScriptFramework } from '../../src/frameworks/nativescript';
import { MobileProject } from '../../src/project';

describe('frameworks: NativeScript', () => {
  let project: MobileProject;

  beforeEach(async () => { });

  it('should detect project', async () => {
    project = new MobileProject(
      '../common/test/fixtures/frameworks/NativeScriptApp',
    );
    const fwk = await NativeScriptFramework.getFramework(project);
    expect(fwk).not.toBe(null);
  });
});
