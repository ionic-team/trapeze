---
title: React Native
sidebar_label: React Native
---

Trapeze makes it easy to automate the configuration of your React Native projects.

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

React Native projects usually have platform projects in a single project directory. Thus, pass the main project directory to the `MobileProject` constructor, and then pass the names of the `ios` and `android` directories relative to the root:

```typescript
import { MobileProject, MobileProjectConfig } from '@trapezedev/project';

const config: MobileProjectConfig = {
  ios: {
    path: 'ios',
  },
  android: {
    path: 'android',
  },
};

const project = new MobileProject('/path/to/project/dir', config);
await project.load();
```