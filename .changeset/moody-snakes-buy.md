---
'@trapezedev/configure': major
'@trapezedev/gradle-parse': major
'@trapezedev/project': major
---

Changed merge algorithm for XML operations. This is a breaking change.

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

