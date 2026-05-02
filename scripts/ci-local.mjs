#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const npmExecPath = process.env.npm_execpath;
const npmCommand = npmExecPath
  ? process.execPath
  : process.platform === 'win32'
    ? 'npm.cmd'
    : 'npm';
const npmCommandPrefix = npmExecPath ? [npmExecPath] : [];
const args = new Set(process.argv.slice(2));
const validArgs = new Set([
  '--all',
  '--build-only',
  '--help',
  '--smoke-only',
  '--visual-only',
]);

for (const arg of args) {
  if (!validArgs.has(arg)) {
    console.error(`[ci-local] Unknown option: ${arg}`);
    process.exit(1);
  }
}

if (args.has('--help')) {
  console.log(`
Usage:
  npm run ci:local       Clean install, build checks, and smoke tests
  npm run ci:local:all   Clean install, build checks, smoke tests, and visual checks
  npm run ci:github      Same as ci:local, using the npm version pinned for GitHub
  npm run ci:github:all  Same as ci:local:all, using the npm version pinned for GitHub
  npm run ci:build       Typecheck, unit tests, and build
  npm run ci:smoke       Playwright smoke tests
  npm run ci:visual      Production copy and visual route checks
`);
  process.exit(0);
}

let playwrightInstalled = false;

function run(command, commandArgs = [], options = {}) {
  const printable = npmExecPath && command === process.execPath && commandArgs[0] === npmExecPath
    ? ['npm', ...commandArgs.slice(1)].join(' ')
    : [command, ...commandArgs].join(' ');
  console.log(`\n[ci-local] ${printable}`);

  const result = spawnSync(command, commandArgs, {
    env: {
      ...process.env,
      ...options.env,
    },
    shell: false,
    stdio: 'inherit',
  });

  if (result.error) {
    console.error(`[ci-local] Failed to start: ${printable}`);
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runNpm(npmArgs = [], options = {}) {
  run(npmCommand, [...npmCommandPrefix, ...npmArgs], options);
}

function runNpmScript(scriptName, scriptArgs = [], options = {}) {
  runNpm([
    'run',
    scriptName,
    ...(scriptArgs.length > 0 ? ['--', ...scriptArgs] : []),
  ], options);
}

function installPlaywrightChromium() {
  if (playwrightInstalled) {
    return;
  }

  const installArgs = ['exec', '--', 'playwright', 'install'];

  if (process.platform === 'linux') {
    installArgs.push('--with-deps');
  }

  installArgs.push('chromium');
  runNpm(installArgs);
  playwrightInstalled = true;
}

function runBuildChecks() {
  runNpmScript('typecheck');
  runNpmScript('test');
  runNpmScript('build');
}

function runSmokeChecks() {
  installPlaywrightChromium();
  runNpmScript('test:smoke', ['--reporter=list']);
}

function runVisualChecks() {
  const productionEnv = {
    APP_ENV: 'production',
    HOST: '127.0.0.1',
    NODE_ENV: 'production',
    PLAYWRIGHT_BASE_URL: 'http://127.0.0.1:3100',
    PLAYWRIGHT_APP_ENV: 'production',
    PLAYWRIGHT_ENABLE_ADMIN: 'false',
    PLAYWRIGHT_WEB_SERVER_COMMAND: 'npm run start',
    PLAYWRIGHT_WEB_SERVER_URL: 'http://127.0.0.1:3100/uk',
    PORT: '3100',
    VITE_APP_ENV: 'production',
    VITE_ENABLE_ADMIN: 'false',
  };

  runNpmScript('build', [], { env: productionEnv });
  installPlaywrightChromium();
  runNpmScript('test:production-copy', ['--reporter=list'], { env: productionEnv });
  runNpmScript('test:visual', ['--reporter=list'], { env: productionEnv });
}

if (args.has('--build-only')) {
  runBuildChecks();
} else if (args.has('--smoke-only')) {
  runSmokeChecks();
} else if (args.has('--visual-only')) {
  runVisualChecks();
} else {
  runNpm(['ci', '--foreground-scripts']);
  runBuildChecks();
  runSmokeChecks();

  if (args.has('--all')) {
    runVisualChecks();
  }
}
