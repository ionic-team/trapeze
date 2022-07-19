import { Operation } from "../src/definitions";

export const makeOp = (platform: string, name: string, value: any): Operation => ({
  id: `${platform}.${name}`,
  platform,
  name,
  value,
  iosTarget: null,
  iosBuild: null,
  displayText: expect.anything(),
});