# @trapezedev/project

## 7.0.8

### Patch Changes

- Fixed iOS build number issue
  - @trapezedev/gradle-parse@7.0.8

## 7.0.7

### Patch Changes

- Fixed error setting versionCode and buildNumber when values are strings
  - @trapezedev/gradle-parse@7.0.7

## 7.0.6

### Patch Changes

- 7f9e319: Target older JDK for gradle parser"
- de2dafd: Add support for --ios and --android flags to specify platform operations
- Improved version code handling
- Updated dependencies [f4dbda6]
- Updated dependencies [7f9e319]
- Updated dependencies
  - @trapezedev/gradle-parse@7.0.6

## 7.0.6-next.1

### Patch Changes

- Target older JDK for gradle parser"
- Updated dependencies [f4dbda6]
- Updated dependencies
  - @trapezedev/gradle-parse@7.0.6-next.1

## 7.0.6-next.0

### Patch Changes

- Add support for --ios and --android flags to specify platform operations
  - @trapezedev/gradle-parse@7.0.6-next.0

## 7.0.5

### Patch Changes

- Fixed XML attribute setting
  - @trapezedev/gradle-parse@7.0.5

## 7.0.4

### Patch Changes

- Tweaked variable substitution
  - @trapezedev/gradle-parse@7.0.4

## 7.0.3

### Patch Changes

- Added support for typed variables
  - @trapezedev/gradle-parse@7.0.3

## 7.0.2

### Patch Changes

- Tweaked how files are added to xcode project
  - @trapezedev/gradle-parse@7.0.2

## 7.0.1

### Patch Changes

- Add files to Xcode project when created
  - @trapezedev/gradle-parse@7.0.1

## 7.0.0

### Major Changes

- Added support for android namespace

### Patch Changes

- @trapezedev/gradle-parse@7.0.0

## 6.0.12

### Patch Changes

- Added support for versionNameSuffix on Android, falsy check for env vars, dynamic op loading
  - @trapezedev/gradle-parse@6.0.12

## 6.0.11

### Patch Changes

- Exit pre
- 066810b: Pre-release for testing dynamic ops and env var loading changes
  - @trapezedev/gradle-parse@6.0.11

## 6.0.11-next.0

### Patch Changes

- Pre-release for testing dynamic ops and env var loading changes
  - @trapezedev/gradle-parse@6.0.11-next.0

## 6.0.10

### Patch Changes

- Tweaked method for finding java
  - @trapezedev/gradle-parse@6.0.10

## 6.0.9

### Patch Changes

- Create parent directories when writing new files
  - @trapezedev/gradle-parse@6.0.9

## 6.0.8

### Patch Changes

- Fixed strings and some XML handling
  - @trapezedev/gradle-parse@6.0.8

## 6.0.7

### Patch Changes

- Added support for XCConfig files on iOS
  - @trapezedev/gradle-parse@6.0.7

## 6.0.6

### Patch Changes

- Added support for modifying iOS .strings files
  - @trapezedev/gradle-parse@6.0.6

## 6.0.5

### Patch Changes

- Added project.copy command to copy files in project
  - @trapezedev/gradle-parse@6.0.5

## 6.0.4

### Patch Changes

- Fixed XML replace issue #125
  - @trapezedev/gradle-parse@6.0.4

## 6.0.3

### Patch Changes

- Added support for changing the Android appName
  - @trapezedev/gradle-parse@6.0.3

## 6.0.2

### Patch Changes

- Add support for project-level operations #107
  - @trapezedev/gradle-parse@6.0.2

## 6.0.1

### Patch Changes

- Added more extensive logging #121
  - @trapezedev/gradle-parse@6.0.1

## 6.0.0

### Major Changes

- Added support for inserting gradle variables

### Patch Changes

- @trapezedev/gradle-parse@6.0.0

## 5.0.10

### Patch Changes

- Version bump
  - @trapezedev/gradle-parse@5.0.10

## 5.0.9

### Patch Changes

- 67b37ff: 5.0.9-next.1
- 25c4995: Support finding java on PATH in addition to JAVA_HOME
- Support finding java on path in addition to JAVA_HOME
- Updated dependencies [25c4995]
  - @trapezedev/gradle-parse@5.0.9

## 5.0.9-next.1

### Patch Changes

- 5.0.9-next.1
  - @trapezedev/gradle-parse@5.0.9-next.1

## 5.0.9-next.0

### Patch Changes

- Support finding java on PATH in addition to JAVA_HOME
- Updated dependencies
  - @trapezedev/gradle-parse@5.0.9-next.0

## 5.0.8

### Patch Changes

- Fixed setBuild when value is null
  - @trapezedev/gradle-parse@5.0.8

## 5.0.7

### Patch Changes

- Reverted variable change to support use in string values with dots. #112
  - @trapezedev/gradle-parse@5.0.7

## 5.0.6

### Patch Changes

- Tweaked logging for variable processing per #96
  - @trapezedev/gradle-parse@5.0.6

## 5.0.5

### Patch Changes

- Improved error handling for project load
  - @trapezedev/gradle-parse@5.0.5

## 5.0.4

### Patch Changes

- Moved internal types to dependencies to fix build issues
- Updated dependencies
  - @trapezedev/gradle-parse@5.0.4

## 5.0.3

### Patch Changes

- 5.0.3
- Updated dependencies
  - @trapezedev/gradle-parse@5.0.3

## 5.0.2

### Patch Changes

- More copy operation work
- Updated dependencies
  - @trapezedev/gradle-parse@5.0.2

## 5.0.1

### Patch Changes

- Fixed JSON parsing and added copy operation
- Updated dependencies
  - @trapezedev/gradle-parse@5.0.1

## 5.0.0

### Major Changes

- 10637dc: Changed merge algorithm for XML operations. This is a breaking change.

  ## New XML Merge Algorithm (breaking)

  The merge operation was changed to support deep trees and fix some issues with the past algorithm. To do this, a breaking change was required in that a matching root tag should be supplied to merge the two trees. In the old format this was not required.

  ## Old format:

  ```yaml
  xml:
    - file: file.xml
      target: entries/field
      merge: |
        <string>Value</string>
  ```

  ## New format:

  ```yaml
  xml:
    - file: file.xml
      target: entries/field
      merge: |
        <field>
          <string>Value</string>
        </field>
  ```

### Patch Changes

- Updates to XML operations and support for multiple operations on single files
- 10637dc: Fix build
- Updated dependencies [10637dc]
- Updated dependencies
- Updated dependencies [10637dc]
  - @trapezedev/gradle-parse@5.0.0

## 5.0.0-next.1

### Patch Changes

- Fix build
- Updated dependencies
  - @trapezedev/gradle-parse@5.0.0-next.1

## 5.0.0-next.0

### Major Changes

- Changed merge algorithm for XML operations. This is a breaking change.

  ## New XML Merge Algorithm (breaking)

  The merge operation was changed to support deep trees and fix some issues with the past algorithm. To do this, a breaking change was required in that a matching root tag should be supplied to merge the two trees. In the old format this was not required.

  ## Old format:

  ```yaml
  xml:
    - file: file.xml
      target: entries/field
      merge: |
        <string>Value</string>
  ```

  ## New format:

  ```yaml
  xml:
    - file: file.xml
      target: entries/field
      merge: |
        <field>
          <string>Value</string>
        </field>
  ```

### Patch Changes

- Updated dependencies
  - @trapezedev/gradle-parse@5.0.0-next.0

## 4.0.1

### Patch Changes

- Gradle exact targeting
- Updated dependencies
  - @trapezedev/gradle-parse@4.0.1

## 4.0.0

### Patch Changes

- e920098: Fix for incrementBuild with pbx files when defaults aren't set
- 7a91d46: Fixing deps
- 6028709: 4.0.0
- Updated dependencies [e920098]
- Updated dependencies [7a91d46]
- Updated dependencies [6028709]
  - @trapezedev/gradle-parse@4.0.0

## 4.0.0-next.2

### Patch Changes

- Fix for incrementBuild with pbx files when defaults aren't set

- Updated dependencies []:
  - @trapezedev/gradle-parse@4.0.0-next.2

## 4.0.0-next.1

### Patch Changes

- Fixing deps

- Updated dependencies []:
  - @trapezedev/gradle-parse@4.0.0-next.1

## 4.0.0

### Patch Changes

- Fixing release

- Updated dependencies []:
  - @trapezedev/gradle-parse@4.0.0

## 4.0.0-next.0

### Major Changes

- This update adds support for arbitrary plist files. Use the `file` field to reference a plist file relative to the native iOS project path.

  This update also had some internal refactoring which has impacted some public types to make them stronger and more concrete, and removes a few legacy operation aliases.

  ## Breaking Changes

  **`@trapezedev/configure`**

  The `infoPlist` operation for `ios` was removed. This was just an alias for `plist` Use the `plist` operation

  **`@trapezedev/project`**

  `JsonFile.getData()` was renamed to `getDocument()` to be more consistent with the other file wrappers.

  VFS types have been made more concrete and data stored in the VFS must now be either a `string` or extend `VFSStorable`.

### Patch Changes

- Updated dependencies []:
  - @trapezedev/gradle-parse@4.0.0

## 3.0.7

### Patch Changes

- Added options for entitlements to support merging or replacing

- Updated dependencies []:
  - @trapezedev/gradle-parse@3.0.7

## 3.0.6

### Patch Changes

- Added new XML operations to iOS and updated docs"

- Updated dependencies []:
  - @trapezedev/gradle-parse@3.0.6

## 3.0.5

### Patch Changes

- Improved error logging

- Updated dependencies []:
  - @trapezedev/gradle-parse@3.0.5

## 3.0.4

### Patch Changes

- Release ios and android directory options

- Updated dependencies []:
  - @trapezedev/gradle-parse@3.0.4

## 3.0.3

### Patch Changes

- Added support for deleting nodes and attributes per #73

- Updated dependencies []:
  - @trapezedev/gradle-parse@3.0.3

## 3.0.2

### Patch Changes

- Added support for generating Info.plist if not exists

- Updated dependencies []:
  - @trapezedev/gradle-parse@3.0.2

## 3.0.1

### Patch Changes

- Updated dependencies []:
  - @trapezedev/gradle-parse@3.0.1

## 3.0.0

### Major Changes

- Releasing first version of Trapeze

### Patch Changes

- Updated dependencies []:
  - @trapezedev/gradle-parse@3.0.0

## 2.0.10

### Patch Changes

- Added support for Android properties files

- Updated dependencies []:
  - @capacitor/gradle-parse@2.0.10

## 2.0.9

### Patch Changes

- JSON support and Windows

- Updated dependencies []:
  - @capacitor/gradle-parse@2.0.9

## 2.0.8

### Patch Changes

- Release with latest updates

- Updated dependencies []:
  - @capacitor/gradle-parse@2.0.8

## 2.0.7

### Patch Changes

- Bad release
- Updated dependencies
  - @capacitor/gradle-parse@2.0.7

### Major Changes

- Bump to 2.0.6

### Patch Changes

- Updated dependencies
  - @capacitor/gradle-parse@3.0.0

## 2.0.6

### Patch Changes

- Add support for overriding gradle variables
- Updated dependencies
  - @capacitor/gradle-parse@2.0.6

## 2.0.5

### Patch Changes

- Add merge option for manifest nodes
  - @capacitor/gradle-parse@2.0.5

## 2.0.4

### Patch Changes

- Merge manifest nodes. Fixes #55
  - @capacitor/gradle-parse@2.0.4

## 2.0.3

### Patch Changes

- Fixing package fixing
- Updated dependencies
  - @capacitor/gradle-parse@2.0.3

## 2.0.2

### Patch Changes

- Built

## 2.0.1

### Patch Changes

- Added support for replace for gradle files

## 2.0.0

### Major Changes

- Fixed issue with iOS getBuild and made several iOS project functions async

## 1.1.1

### Patch Changes

- Fix loading of capacitor config
- Updated dependencies
  - @capacitor/gradle-parse@1.0.23

## 1.1.0

### Minor Changes

- Support customizing the project root and loading capacitor config

## 1.0.31

### Patch Changes

- remove bad rollup packages

## 1.0.30

### Patch Changes

- Changset
- Updated dependencies
  - @capacitor/gradle-parse@1.0.22

## 1.0.29

### Patch Changes

- Moved to smaller prettier build
- Updated dependencies
  - @capacitor/gradle-parse@1.0.21
