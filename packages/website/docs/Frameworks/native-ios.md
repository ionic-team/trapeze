---
title: Native iOS
sidebar_label: Native iOS
---

Trapeze makes it easy to automate the configuration of your native iOS projects. When targeting a standalone iOS project, no operations for other platforms (Android, etc) will apply.

## Configuration Tool

To use the [Configuration-driven](../operations/getting-started) experience, first create a yaml file using the [options available](../operations/getting-started):

Here's an example:

```yaml title="config.yaml"
platforms:
  ios:
    targets:
      App:
        version: 16.4

```

```bash
npm install @trapezedev/configure
npx trapeze run config.yaml
```

## API

Pass the main iOS project directory to the `MobileProject` constructor, and then the relative path to the iOS project (such as `'.'` if the root and iOS project paths are the same):

```typescript
import { MobileProject, MobileProjectConfig } from '@trapezedev/project';

const config: MobileProjectConfig = {
  ios: {
    path: '.',
  },
};

const project = new MobileProject('/path/to/project/dir', config);
await project.load();
```