#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
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
  npm run ci:build       Typecheck, unit tests, and build
  npm run ci:smoke       Playwright smoke tests
  npm run ci:visual      Production copy and visual route checks
`);
  process.exit(0);
}

let playwrightInstalled = false;

function run(command, commandArgs = [], options = {}) {
  const printable = [command, ...commandArgs].join(' ');
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

function runNpmScript(scriptName, scriptArgs = [], options = {}) {
  run(npmCommand, [
    'run',
    scriptName,
    ...(scriptArgs.length > 0 ? ['--', ...scriptArgs] : []),
  ], options);
}

function installPlaywrightChromium() {
  if (playwrightInstalled) {
    return;
  }

  const installArgs = ['playwright', 'install'];

  if (process.platform === 'linux') {
    installArgs.push('--with-deps');
  }

  installArgs.push('chromium');
  run(npxCommand, installArgs);
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
    PLAYWRIGHT_APP_ENV: 'production',
    PLAYWRIGHT_ENABLE_ADMIN: 'false',
  };

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
  run(npmCommand, ['ci', '--foreground-scripts']);
  runBuildChecks();
  runSmokeChecks();

  if (args.has('--all')) {
    runVisualChecks();
  }
}
