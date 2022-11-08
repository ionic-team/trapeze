import { readFile } from '@ionic/utils-fs';

import fetch from 'cross-fetch';

// Supporting reading files from either a path or URL
export async function readSource(pathOrUrl: string) {
  if (/^(https?:\/\/)/.test(pathOrUrl)) {
    const res = await fetch(pathOrUrl);
    return res.text();
  }

  return readFile(pathOrUrl);
}