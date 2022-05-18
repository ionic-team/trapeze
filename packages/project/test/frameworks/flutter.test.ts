import { FlutterFramework } from '../../src/frameworks/flutter';
import { MobileProject } from '../../src/project';

describe('frameworks: Flutter', () => {
  let project: MobileProject;

  beforeEach(async () => {
    project = new MobileProject('../common/test/fixtures/frameworks/flutter_configure_test');
  });

  it('should detect flutter project', async () => {
    expect(await FlutterFramework.getFramework(project)).not.toBe(null);
  });
});
