---
title: CI/CD Workflows
sidebar_position: 7
sidebar_label: CI/CD
---

Trapeze is most powerful when used as part of a CI/CD or Mobile DevOps automation workflow, such as one using the [Appflow](https://useappflow.com/) Mobile DevOps platform that Trapeze was initially designed for.

To use it in this environment, run the configuration tool in the desired step of your Mobile build workflow. Some examples of common use cases follow.

## Auto-incrementing Build Numbers

If your CI/CD service provides an environment variable that automatically increments ([Appflow](https://useappflow.com/) does), then updating the build number for your app is straightforward.

```yaml title="ci.yml"
vars:
  CI_BUILD_NUMBER:
    default: 1

platforms:
  ios:
    buildNumber: $CI_BUILD_NUMBER
  android:
    versionCode: $CI_BUILD_NUMBER
```

Then call this script as part of your `build` step. For example, here's how it works in Appflow:

```
  "scripts": {
    "appflow:build": "if [ \"$CI_PLATFORM\" != \"web\" ]; then npx trapeze run ci.yaml -y --$CI_PLATFORM; fi && npm run build",
  },
```
