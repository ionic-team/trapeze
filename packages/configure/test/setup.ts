// Keep the Project API's debug logging out of the test output.
process.env.VERBOSE = 'false';

const ORIGINAL_ARGV = [...process.argv];
const ORIGINAL_ENV = { ...process.env };

// Tests that exercise argument or variable handling mutate these globals, and a
// leaked value silently changes the behaviour of every later test in the file.
afterEach(() => {
  process.argv = [...ORIGINAL_ARGV];
  process.env = { ...ORIGINAL_ENV };
});
