import {
  IosPbxArrayValue,
  IosPbxProject,
  IosSPMPackageDefinition,
} from '../definitions';

export function addSPMPackageToProject(
  project: IosPbxProject,
  targetId: string,
  pkg: IosSPMPackageDefinition,
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

  const packageReferenceComment = `XCRemoteSwiftPackageReference "${pkg.name}"`;

  const { uuid: spmPackageReferenceUUID, comment: spmPackageReferenceComment } =
    helper.addOrUpdateEntry(
      'XCRemoteSwiftPackageReference',
      packageReferenceComment,
      {
        isa: 'XCRemoteSwiftPackageReference',
        repositoryURL: JSON.stringify(pkg.repositoryURL),
        requirement: {
          // todo: support different ranges?
          kind: 'upToNextMajorVersion',
          minimumVersion: pkg.version,
        },
      },
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
