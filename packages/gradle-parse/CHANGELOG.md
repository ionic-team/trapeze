# @capacitor/gradle-parse

## 6.0.2

## 6.0.1

## 6.0.0

## 5.0.10

## 5.0.9

### Patch Changes

- 25c4995: Support finding java on PATH in addition to JAVA_HOME

## 5.0.9-next.1

## 5.0.9-next.0

### Patch Changes

- Support finding java on PATH in addition to JAVA_HOME

## 5.0.8

## 5.0.7

## 5.0.6

## 5.0.5

## 5.0.4

### Patch Changes

- Moved internal types to dependencies to fix build issues

## 5.0.3

### Patch Changes

- 5.0.3

## 5.0.2

### Patch Changes

- More copy operation work

## 5.0.1

### Patch Changes

- Fixed JSON parsing and added copy operation

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

## 5.0.0-next.1

### Patch Changes

- Fix build

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

## 4.0.1

### Patch Changes

- Gradle exact targeting

## 4.0.0

### Patch Changes

- e920098: Fix for incrementBuild with pbx files when defaults aren't set
- 7a91d46: Fixing deps
- 6028709: 4.0.0

## 4.0.0-next.2

### Patch Changes

- Fix for incrementBuild with pbx files when defaults aren't set

## 4.0.0-next.1

### Patch Changes

- Fixing deps

## 4.0.0

### Patch Changes

- Fixing release

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

## 3.0.7

## 3.0.6

## 3.0.5

### Patch Changes

- Improved error logging

## 3.0.4

### Patch Changes

- Release ios and android directory options

## 3.0.3

### Patch Changes

- Added support for deleting nodes and attributes per #73

## 3.0.2

## 3.0.1

## 3.0.0

### Major Changes

- Releasing first version of Trapeze

## 2.0.10

## 2.0.9

## 2.0.8

### Patch Changes

- Release with latest updates

## 2.0.7

### Patch Changes

- Bad release

### Major Changes

- Bump to 2.0.6

## 2.0.6

### Patch Changes

- Add support for overriding gradle variables

## 2.0.5

## 2.0.4

## 2.0.3

### Patch Changes

- Fixing package fixing

## 1.0.23

### Patch Changes

- Fix loading of capacitor config

## 1.0.22

### Patch Changes

- Changset

## 1.0.21

### Patch Changes

- Moved to smaller prettier build
