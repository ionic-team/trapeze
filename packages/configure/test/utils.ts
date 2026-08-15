import { copy } from '@ionic/utils-fs';
import { rm } from 'fs/promises';
import { join } from 'path';
import { temporaryDirectory } from 'tempy';

import { Operation } from '../src/definitions';

const FIXTURES_DIR = '../common/test/fixtures';

export const makeOp = (platform: string, name: string, value: any): Operation => ({
  id: `${platform}.${name}`,
  platform,
  name,
  value,
  iosTarget: null,
  iosBuild: null,
  displayText: expect.anything(),
});

export function fixturePath(name: string): string {
  return join(FIXTURES_DIR, name);
}

/**
 * Creates a temporary directory and deletes it once the current test finishes,
 * whether it passed or threw.
 *
 * Call from a test body or from a `beforeEach` hook.
 */
export function useTempDir(): string {
  const dir = temporaryDirectory();

  onTestFinished(() => rm(dir, { force: true, recursive: true }));

  return dir;
}

/**
 * Copies a fixture directory into a temporary directory managed by `useTempDir`.
 */
export async function useFixture(name: string): Promise<string> {
  const dir = useTempDir();

  await copy(fixturePath(name), dir);

  return dir;
}
