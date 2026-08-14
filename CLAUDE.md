# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Trapeze automates configuration of native iOS/Android projects (pbxproj, plist, XML, Gradle, JSON, `.properties`, `.strings`, `.xcconfig`) for Capacitor, Cordova, React Native, Flutter, .NET MAUI, NativeScript and plain native projects. Two published layers:

- `@trapezedev/project` — the Project API (the engine). All file parsing/mutation lives here.
- `@trapezedev/configure` — the `trapeze` CLI. A YAML front-end that compiles a config file into calls against the Project API.
- `@trapezedev/gradle-parse` — a Java/Groovy jar used by the Project API to parse Gradle files.

## Commands

npm workspaces + Turborepo. Workspaces: `packages/{configure,gradle-parse,project,website}`. `packages/common` (shared test fixtures) and `packages/utils` (scratch scripts) are **not** workspaces.

```bash
npm run build                      # turbo build, respects package dep order
npm test                           # turbo test (builds deps first)

npm run build -w packages/project  # build a single package (tsc)
npm test -w packages/configure     # test a single package (vitest)
```

Single test file / single test — must run with the package as cwd, since fixtures are resolved relative to it (`../common/test/fixtures/...`):

```bash
cd packages/project && npx vitest run test/project.ios.test.ts
cd packages/configure && npx vitest run test/ops/ios.plist.test.ts -t 'should use target'
```

`packages/configure` imports `@trapezedev/project` from its **built** `dist`. After editing `packages/project`, rebuild it before running configure tests directly with vitest (root `npm test` does this via turbo).

Other:

```bash
npm run build-jar -w packages/gradle-parse   # only when the Java source changes; needs a JDK
npm start -w packages/website                # docs site (Docusaurus) at packages/website/docs
npm run changeset                            # required for any user-facing change to a published package
npm run shipit                               # build jar + build + test + changeset publish + push tags
```

Gradle operations shell out to `java` at runtime (`JAVA_HOME` or `java` on PATH). Tests touching Gradle fail without it.

## Architecture

### Project API (`packages/project`)

`MobileProject` (`src/project.ts`) is the root object: `projectRoot`, a `MobileProjectConfig` (`ios.path`, `android.path`), an `IosProject`, an `AndroidProject`, a detected `Framework`, and a `VFS`. `load()` instantiates the platform projects for whichever platform directories exist, then runs framework detection.

**The VFS is the central abstraction** (`src/vfs.ts`). Every file is opened once into the VFS, mutated in memory, and committed at the end (`project.commit()`). Never write project files directly — the VFS is what powers `--diff`, `--dry-run` and the interactive "apply changes?" confirmation, and it lets several operations edit the same file without clobbering each other. Each file wrapper (`XmlFile`, `PlistFile`, `JsonFile`, `PropertiesFile`, `StringsFile`, `XCConfigFile`, `GradleFile`) extends `VFSStorable` and registers its own commit + diff functions when loaded.

`IosProject` is target- and build-configuration-aware: most methods take `(targetName, buildName)` where `null` means "the app target" / "all build configurations". `AndroidProject` works off the `android/app` layout and delegates Gradle edits to `GradleFile`, which spawns the Java parser to get a Groovy AST and then splices text back by source line/column.

Framework detection (`src/frameworks/`): each framework class exposes a static `getFramework(project)` that returns an instance or `null` based on marker files. `MobileProject.detectFramework()` probes them in a fixed order and takes the first match — order matters (e.g. Flutter/React Native before Capacitor/Cordova, native last).

### Configure CLI (`packages/configure`)

Pipeline: `bin/trapeze` → `src/index.ts` (commander, defines `run [configFile]` and its flags) → `ctx.ts loadContext()` (yargs args + loads the `MobileProject`) → `tasks/run.ts`:

1. `yaml-config.ts` parses the YAML, resolves `vars` from the environment, prompts for any that are missing, and interpolates `$VAR` references through the whole tree (`ctx.ts str()`).
2. `op.ts processOperations()` flattens `platforms.ios.targets.<target>.builds.<build>.<op>` / `platforms.android.<op>` / `project.<op>` into a flat `Operation[]`, each with an id of `<platform>.<name>` plus `iosTarget`/`iosBuild`.
3. `operations/index.ts loadHandlers()` discovers handlers at runtime by scanning the `operations/` directory and reading each module's exported `OPS` array — **there is no central registry to update**.
4. Each operation runs against the Project API; operations for a platform that isn't present are skipped.
5. `checkModifiedFiles()` lists modified VFS files, optionally prints diffs, then commits (or prompts, unless `-y`/`--dry-run`/`--no-commit`).

**Adding a new operation:**

1. `src/operations/<platform>/<name>.ts` exporting `export default async function execute(ctx: Context, op: Operation)` and `export const OPS: OperationMeta = ['<platform>.<name>']`.
2. Value types in `src/definitions.ts`.
3. A `case` in `createOpDisplayText()` in `src/op.ts` for the CLI summary line.
4. Test in `test/ops/<platform>.<name>.test.ts`.
5. Docs in `packages/website/docs/operations/<platform>.md`.

### Tests

vitest with `globals: true` — `describe`/`it`/`expect` are ambient, don't import them. The standard pattern copies a fixture from `packages/common/test/fixtures/` into a fresh `tempy` directory in `beforeEach`, runs against it, and removes it in `afterEach`. Add new fixtures under `packages/common/test/fixtures/`.

## Releases

Changesets, with `@trapezedev/configure`, `@trapezedev/project` and `@trapezedev/gradle-parse` in a **fixed** version group (they always bump together). Add a changeset for any change to a published package.
