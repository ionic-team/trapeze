import { CapacitorFramework } from '../../src/frameworks/capacitor';
import { DotNetMauiFramework } from '../../src/frameworks/dotnet-maui';
import { MobileProject } from '../../src/project';

describe('frameworks: Capacitor', () => {
  let project: MobileProject;

  beforeEach(async () => {});

  it('should detect project', async () => {
    project = new MobileProject(
      '../common/test/fixtures/ios-and-android',
    );
    const fwk = await CapacitorFramework.getFramework(project);
    expect(fwk).not.toBe(null);
  });
});
