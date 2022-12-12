import kleur from 'kleur';

export function exit(msg, e) {
  console.error(kleur.red(`ERROR: ${msg}`));
  if (e) {
    console.error(e);
  }
  return process.exit(0);
}