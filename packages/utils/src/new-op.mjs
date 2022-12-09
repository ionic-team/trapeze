import prompt from 'prompts';
import kleur from 'kleur';
import { VFS } from '@trapezedev/project';
import { exit } from './utils.mjs';


export default async function newOp({ name, platform }) {
  console.log(name, platform);
  let newName = name ?? await prompt({
    type: 'text',
    name: 'name',
    message: 'New op name?'
  }).name;

  if (!newName) {
    exit('Missing name');
  }

  let newPlatform = platform ?? await prompt({
    type: 'select',
    name: 'platform',
    message: 'New op platform?',
    choices: [
      { title: 'iOS', value: 'ios' },
      { title: 'Android', value: 'android' },
      { title: 'Project', value: 'project' },
    ],
  }).platform;

  if (!newPlatform) {
    exit('Missing platform');
  }

  await create(newName, newPlatform);
}

function addFile(vfs, path, contents) {
  console.log(kleur.green('ADD'), kleur.bold(path));
  vfs.open(path, contents);
}

async function create(name, platform) {
  var vfs = new VFS();
  const nameLower = name.toLocaleLowerCase();
  const id = `${platform}.${nameLower}`;

  console.log(`Adding new op ${id}`);

  function add(path, contents) {
    return addFile(vfs, path, contents);
  }

  add(`configure/src/operations/${platform}/${name}.ts`, '');
  add(`configure/test/ops/${platform}/${name}.test.ts`, '');
}