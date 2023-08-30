import {
  IosPbxArrayValue,
  IosPbxProject,
  IosSPMPackageDefinition,
} from '../definitions';
import path from 'path';

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
    const relativePath = path.relative(projectRoot, path.resolve(projectRoot, pkg.path));
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
      requirement: {
        // todo: support different ranges?
        kind: 'upToNextMajorVersion',
        minimumVersion: pkg.version,
      },
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
