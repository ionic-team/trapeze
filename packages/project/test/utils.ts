import { copy } from '@ionic/utils-fs';
import { rm } from 'fs/promises';
import { join } from 'path';
import { temporaryDirectory } from 'tempy';

const FIXTURES_DIR = '../common/test/fixtures';

/**
 * Copies a fixture directory into a fresh temporary directory and deletes that
 * directory once the current test finishes, whether it passed or threw.
 *
 * Call from a test body or from a `beforeEach` hook.
 */
export async function useFixture(name: string): Promise<string> {
  const dir = temporaryDirectory();

  onTestFinished(() => rm(dir, { force: true, recursive: true }));

  await copy(join(FIXTURES_DIR, name), dir);

  return dir;
}
