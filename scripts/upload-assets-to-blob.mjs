import {
  createReadStream,
  existsSync,
  promises as fs,
  readFileSync,
} from 'node:fs';
import { resolve, relative, extname } from 'node:path';
import process from 'node:process';
import { put } from '@vercel/blob';

const dryRun = process.argv.includes('--dry-run');
const onlyArgIndex = process.argv.indexOf('--only');
const onlyPath = onlyArgIndex !== -1 ? process.argv[onlyArgIndex + 1] : null;
const projectRoot = process.cwd();
const assetsRoot = resolve(projectRoot, 'blob-assets');
const manifestPath = resolve(projectRoot, 'blob-assets-manifest.json');
const envLocalPath = resolve(projectRoot, '.env.local');
const envPath = resolve(projectRoot, '.env');

const supportedDirs = ['images', 'fonts', 'castrel-proxy/packages'];

function getContentType(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.ico') return 'image/x-icon';
  if (ext === '.woff2') return 'font/woff2';
  if (ext === '.woff') return 'font/woff';
  if (ext === '.ttf') return 'font/ttf';
  if (ext === '.otf') return 'font/otf';
  if (ext === '.sha256') return 'text/plain; charset=utf-8';
  return 'application/octet-stream';
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === '.DS_Store') continue;

    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function stripQuotes(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function loadEnvFile(path, options = {}) {
  const { override = false, lockedEnvKeys = new Set() } = options;
  if (!existsSync(path)) return;

  const content = readFileSync(path, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const equalIndex = trimmed.indexOf('=');
    if (equalIndex <= 0) continue;

    const key = trimmed
      .slice(0, equalIndex)
      .trim()
      .replace(/^export\s+/, '');
    const value = stripQuotes(trimmed.slice(equalIndex + 1));
    if (!key) continue;

    if (
      process.env[key] === undefined ||
      (override && !lockedEnvKeys.has(key))
    ) {
      process.env[key] = value;
    }
  }
}

async function main() {
  // Priority: shell env > .env.local > .env
  const shellEnvKeys = new Set(Object.keys(process.env));
  loadEnvFile(envPath, { override: false, lockedEnvKeys: shellEnvKeys });
  loadEnvFile(envLocalPath, { override: true, lockedEnvKeys: shellEnvKeys });

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!dryRun && !token) {
    throw new Error('BLOB_READ_WRITE_TOKEN is required');
  }

  const allFiles = [];
  if (onlyPath) {
    const onlyRoot = resolve(assetsRoot, onlyPath);
    const relOnly = relative(assetsRoot, onlyRoot).replaceAll('\\', '/');
    if (relOnly.startsWith('..') || relOnly === '') {
      throw new Error(`--only must reference a file or subdirectory inside ${assetsRoot}`);
    }
    const stat = await fs.stat(onlyRoot).catch(() => null);
    if (!stat) {
      throw new Error(`--only path does not exist: ${onlyPath}`);
    }
    if (stat.isDirectory()) {
      allFiles.push(...(await walk(onlyRoot)));
    } else if (stat.isFile()) {
      allFiles.push(onlyRoot);
    }
  } else {
    for (const dirName of supportedDirs) {
      const dirPath = resolve(assetsRoot, dirName);
      const exists = await fs
        .stat(dirPath)
        .then((s) => s.isDirectory())
        .catch(() => false);
      if (!exists) continue;
      allFiles.push(...(await walk(dirPath)));
    }
  }

  // Load existing manifest to preserve mappings not being re-uploaded
  let existingAssets = {};
  if (existsSync(manifestPath)) {
    try {
      const existing = JSON.parse(readFileSync(manifestPath, 'utf8'));
      existingAssets = existing.assets ?? {};
    } catch {
      // Ignore parse errors, start fresh
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    assets: { ...existingAssets },
  };

  for (const filePath of allFiles) {
    const pathname = relative(assetsRoot, filePath).replaceAll('\\', '/');
    const publicPath = `/${pathname}`;

    if (dryRun) {
      manifest.assets[publicPath] = pathname;
      continue;
    }

    const blob = await put(pathname, createReadStream(filePath), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: getContentType(filePath),
      token,
    });

    manifest.assets[publicPath] = blob.url;
    console.log(`uploaded: ${publicPath}`);
  }

  if (dryRun) {
    console.log(`dry run assets: ${Object.keys(manifest.assets).length}`);
    return;
  }

  await fs.writeFile(
    manifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
  console.log(`manifest written: ${manifestPath}`);
  console.log(`assets mapped: ${Object.keys(manifest.assets).length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
