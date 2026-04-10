---
title: Capacitor
sidebar_label: Capacitor
---

Trapeze makes it easy to automate the configuration of your Capacitor projects.

## Configuration Tool

To use the [Configuration-driven](../operations/getting-started) experience, first create a yaml file using the [options available](../operations/getting-started):

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

Capacitor projects usually have platform projects in a single repo. Thus, pass the main project directory to the `MobileProject` constructor, and then pass the relative paths to the iOS and Android projects. Note: Capacitor puts the actual iOS project one level deeper inside of the `ios` folder, so pass that explicitly so the `.xcodeproj` can be found:

```typescript
import { MobileProject, MobileProjectConfig } from '@trapezedev/project';

const config: MobileProjectConfig = {
  ios: {
    path: 'ios/App',
  },
  android: {
    path: 'android',
  },
};

const project = new MobileProject('/path/to/project/dir', config);
await project.load();
```
