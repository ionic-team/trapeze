---
title: Native Android
sidebar_label: Native Android
---

Trapeze makes it easy to automate the configuration of your native Android projects. When targeting a standalone Android project, no operations for other platforms (iOS, etc) will apply.

## Configuration Tool

To use the [Configuration-driven](../configuration-tool) experience, first create a yaml file using the [options available](../configuration-tool):

Here's an example:

```yaml title="config.yaml"
platforms:
  android:
    manifest:
      - file: AndroidManifest.xml
        target: manifest/application
        inject:
          <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

```

```bash
npm install @trapezedev/configure
npx trapeze run config.yaml
```

## API

Pass the main Android project directory to the `MobileProject` constructor, and then the relative path to the Android project (such as `'.'` if the root and Android project paths are the same):

```typescript
import { MobileProject, MobileProjectConfig } from '@trapezedev/project';

const config: MobileProjectConfig = {
  android: {
    path: '.',
  },
};

const project = new MobileProject('/path/to/project/dir', config);
await project.load();
```
