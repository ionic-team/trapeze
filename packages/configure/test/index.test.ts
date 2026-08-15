import { Context } from '../src/ctx';
import { createProgram } from '../src/index';

describe('cli: run', () => {
  it('should declare the project location options', () => {
    const program = createProgram({} as Context);
    const runCommand = program.commands.find(command => command.name() === 'run');

    const help = runCommand!.helpInformation();

    // loadContext() reads these from the command line before commander parses it,
    // so they have to be declared here too or commander rejects them
    expect(help).toContain('--project-root <path>');
    expect(help).toContain('--android-project <path>');
    expect(help).toContain('--ios-project <path>');
  });
});
