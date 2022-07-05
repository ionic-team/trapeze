import { readFile } from '@ionic/utils-fs';

import { parse } from '../src/index';

describe('xml file', () => {
  beforeEach(async () => {
  });

  it('Should load xml file', async () => {
    const file = await readFile('example.kts', { encoding: 'utf-8' });
    await parse(file);
  });
});
