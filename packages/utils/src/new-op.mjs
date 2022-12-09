import prompt from 'prompts';
import kleur from 'kleur';
import { VFS } from '@trapezedev/project';
import { exit } from './utils.mjs';


export default async function newOp({ name, platform }) {
  const { newName } = name ?? await prompt({
    type: 'text',
    name: 'name',
    message: 'New op name?'
  });

  if (!newName) {
    exit('Missing name');
  }


  const { newPlatform } = platform ?? await prompt({
    type: 'select',
    name: 'platform',
    message: 'New op platform?',
    choices: [
      { title: 'iOS', value: 'ios' },
      { title: 'Android', value: 'android' },
      { title: 'Project', value: 'project' },
    ],
  });

  if (!newPlatform) {
    exit('Missing platform');
  }

  await create(newName, newPlatform);
}

function addFile(vfs, path, contents) {
  console.log(kleur.green('ADD'), kleur.grey(path));
  vfs.open(path, contents);
}

async function create(name, platform) {
  var vfs = new VFS();
  const id = `${platform}.${nameLower}`;
  const nameLower = name.toLocaleLowerCase();

  console.log(`Adding new op ${id}`);

  function add(path, contents) {
    return addFile(vfs, path, contents);
  }

  add(`operations/${platform}/${name}.ts`, '');
}