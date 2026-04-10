---
title: Project Operations
sidebar_position: 5
sidebar_label: Project
---

Some commands are available that can operate from the root of the project folder. These can be useful for modifying source files for cross-platform apps or run other administrative tasks on the entire repo or monorepo.

### `copy`

Copy files from the project to anywhere else in the project

```yaml
project:
  copy:
    - src: file1.json
      dest: file2.json
```

### `json`

Modifies JSON files relative to the root of the project. Use `set` to override the element (and clobber any children), or `merge` to merge the values:

```yaml
project:
  json:
    - file: google-services.json
      set:
        project_info:
          project_id: "MY_ID"
    - file: google-services.json
      merge:
        data:
          field: "MY_FIELD"
```

### `xml`

Modifies XML files relative to the root of the project. This operation supports the following XML file modifications:

- `attrs` updates the attributes of the given `target` node.
- `merge` merges the given XML tree supplied to `merge` with the given `target`. Merge expects a matching root node to be supplied. The merge algorithm merges any nodes that match with _at least all_ of the supplied node's attributes, or appends any new children not found in the target node.
- `inject` injects the given XML tree supplied to `inject` inside of the given `target`
- `delete` deletes nodes specified by `delete` in XPath format.
- `deleteAttributes` deletes the given attributes in `deleteAttributes` inside of the given `target`

```yaml
project:
  xml:
    - file: file.xml
      target: entries/field
      merge: |
        <field>
          <string>Value</string>
        </field>
```
