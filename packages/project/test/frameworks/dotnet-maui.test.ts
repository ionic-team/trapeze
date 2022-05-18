import { DotNetMauiFramework } from '../../src/frameworks/dotnet-maui';
import { MobileProject } from '../../src/project';

describe('frameworks: .NET MAUI', () => {
  let project: MobileProject;

  beforeEach(async () => {
  });

  it('should detect Dot Net Maui project', async () => {
    project = new MobileProject('../common/test/fixtures/frameworks/DotNetMauiApp');
    const fwk = await DotNetMauiFramework.getFramework(project);
    expect(fwk).not.toBe(null);
  });
});
