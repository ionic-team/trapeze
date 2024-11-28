import {
  IosPbxArrayValue,
  IosPbxProject,
  IosSPMPackageDefinition,
} from '../definitions';
import path from 'path';
import * as semver from 'semver';

// requirement = {
//   kind = versionRange;
//   maximumVersion = 2.0.0;
//   minimumVersion = 1.0.0;
// };
// requirement = {
//   kind = exactVersion;
//   version = 1.0.0;
// };
// requirement = {
//   kind = upToNextMinorVersion;
//   minimumVersion = 1.0.0;
// };
// requirement = {
//   kind = upToNextMajorVersion;
//   minimumVersion = 1.0.0;
// };
// requirement = {
//   branch = asd;
//   kind = branch;
// };
// requirement = {
//   kind = revision;
//   revision = 5f03bfdc8cb6300ef8355695a3d27d11ba19f6a3;
// };

export function classifyVersion(version: string) {
  if (version.startsWith('#')) {
    return {
      kind: 'revision',
      revision: version.replace('#', ''),
    };
  }

  if (semver.valid(version)) {
    return {
      kind: 'exactVersion',
      version,
    };
  }

  const range = semver.validRange(version);
  if (range) {
    const minimumVersion = semver.minVersion(range)?.version;
    if (version.startsWith('^')) {
      return {
        kind: 'upToNextMajorVersion',
        minimumVersion,
      };
    } else if (version.startsWith('~')) {
      return {
        kind: 'upToNextMinorVersion',
        minimumVersion,
      };
    } else {
      const maximumVersion = semver.coerce(
        version.replace(minimumVersion ?? '', ''),
      )?.version;

      if (maximumVersion && maximumVersion !== minimumVersion) {
        return {
          kind: 'versionRange',
          minimumVersion,
          maximumVersion,
        };
      }

      return {
        kind: 'upToNextMajorVersion',
        minimumVersion,
      };
    }
  }

  return {
    kind: 'branch',
    branch: version,
  };
}

export function addSPMPackageToProject(
  project: IosPbxProject,
  targetId: string,
  pkg: IosSPMPackageDefinition,
  projectRoot: string,
) {
  const helper = new SPMHelper(project);
  const target = project.pbxNativeTargetSection()[targetId];
  const firstProject = project.getFirstProject().firstProject;
  const packageReferences: IosPbxArrayValue[] = (firstProject[
    'packageReferences'
  ] ??= []);
  const packageProductReferences: IosPbxArrayValue[] = (target[
    'packageProductDependencies'
  ] ??= []);
  const frameworkBuildPhaseObj = project.pbxFrameworksBuildPhaseObj(targetId);
  const frameworkBuildPhaseFiles: IosPbxArrayValue[] = (frameworkBuildPhaseObj[
    'files'
  ] ??= []);

  let packageReferenceComment: string;
  let packageReferenceSection: string;
  let packageReferenceSectionContent: Record<string, any>;

  if ('path' in pkg) {
    // local package
    const relativePath = path.relative(
      projectRoot,
      path.resolve(projectRoot, pkg.path),
    );
    packageReferenceComment = `XCLocalSwiftPackageReference "${relativePath}"`;
    packageReferenceSection = 'XCLocalSwiftPackageReference';
    packageReferenceSectionContent = {
      isa: packageReferenceSection,
      relativePath: JSON.stringify(relativePath),
    };
  } else {
    // remote package
    packageReferenceComment = `XCRemoteSwiftPackageReference "${pkg.name}"`;
    packageReferenceSection = 'XCRemoteSwiftPackageReference';
    packageReferenceSectionContent = {
      isa: packageReferenceSection,
      repositoryURL: JSON.stringify(pkg.repositoryURL),
      requirement: classifyVersion(pkg.version),
    };
  }

  const { uuid: spmPackageReferenceUUID, comment: spmPackageReferenceComment } =
    helper.addOrUpdateEntry(
      packageReferenceSection,
      packageReferenceComment,
      packageReferenceSectionContent,
    );

  helper.addOrUpdateArrayEntry(packageReferences, spmPackageReferenceUUID, {
    value: spmPackageReferenceUUID,
    comment: packageReferenceComment,
  });

  for (const lib of pkg.libs) {
    const { uuid: spmProductDependencyUUID } = helper.addOrUpdateEntry(
      'XCSwiftPackageProductDependency',
      lib,
      {
        isa: 'XCSwiftPackageProductDependency',
        package: spmPackageReferenceUUID,
        package_comment: spmPackageReferenceComment,
        productName: lib,
      },
    );

    const libComment = `${lib} in Frameworks`;

    const { uuid: spmBuildFileUuid } = helper.addOrUpdateEntry(
      'PBXBuildFile',
      libComment,
      {
        isa: 'PBXBuildFile',
        productRef: spmProductDependencyUUID,
        productRef_comment: lib,
      },
    );

    helper.addOrUpdateArrayEntry(
      packageProductReferences,
      spmProductDependencyUUID,
      {
        value: spmProductDependencyUUID,
        comment: lib,
      },
    );

    helper.addOrUpdateArrayEntry(frameworkBuildPhaseFiles, spmBuildFileUuid, {
      value: spmBuildFileUuid,
      comment: libComment,
    });
  }
}

class SPMHelper {
  constructor(private pbxProject: IosPbxProject) {}

  addOrUpdateArrayEntry(
    array: IosPbxArrayValue[],
    lookupValue: string,
    value: IosPbxArrayValue,
  ) {
    const existing = array.find(entry => entry.value === lookupValue);

    if (existing) {
      Object.assign(existing, value);
      return;
    }

    array.push(value);
  }

  addOrUpdateEntry(section: string, entryComment: string, entry: any) {
    const pbxSection = this.getOrCreateSection(section);
    const entryUuid = this.getExistingOrGenerateUUID(section, entryComment);

    const entryCommentKey = `${entryUuid}_comment`;
    pbxSection[entryCommentKey] = entryComment;
    pbxSection[entryUuid] = entry;

    return {
      uuid: entryUuid,
      comment: entryComment,
    };
  }

  getExistingOrGenerateUUID(section: string, comment: string) {
    const existingUUID = Object.keys(
      this.pbxProject.hash.project.objects[section],
    )
      .find(key => {
        if (key.endsWith('_comment')) {
          return this.pbxProject.hash.project.objects[section][key] === comment;
        }
        return false;
      })
      ?.replace('_comment', '');

    return existingUUID ?? this.pbxProject.generateUuid();
  }

  getOrCreateSection(section: string) {
    return (this.pbxProject.hash.project.objects[section] ??= new Object());
  }
}
