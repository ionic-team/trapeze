import { loadContext } from '../cli/ctx';

describe('configuration file', () => {
  let ctx;
  beforeEach(() => {
    ctx = loadContext();
  });

  it('should load configuration file', () => {
    console.log(ctx);
  });
});
