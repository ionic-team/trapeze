import xcode from 'xcode';

export function parsePbxProject(filename): Promise<any> {
  const proj = xcode.project(filename);
  return new Promise((resolve, reject) => {
    proj.parse(err => {
      if (err) {
        return reject(err);
      }
      resolve(proj);
    });
  });
}
