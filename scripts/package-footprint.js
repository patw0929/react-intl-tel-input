const path = require('path');
const { spawnSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const chalk = require('chalk');

const FOOTPRINT_SNAPSHOT = path.join(__dirname, '..', '.footprint.json');

function sizeStringToSize(sizeString) {
  const sizeSuffix = /([A-Za-z]+)/.exec(sizeString)[1];
  const sizeMagnitude = /([0-9.]+)/.exec(sizeString)[1];

  let multiplier = 1;

  if (sizeSuffix === 'kB') multiplier = 1000;

  return parseFloat(sizeMagnitude) * multiplier;
}

function getLastReportedFootprint() {
  try {
    const previousFootprint = readFileSync(FOOTPRINT_SNAPSHOT, {
      encoding: 'utf-8',
    });
    const parsedFootprint = JSON.parse(previousFootprint);

    return parsedFootprint;
  } catch (e) {
    console.log('No footprint available');

    return {};
  }
}

function getCurrentFootprint() {
  const { stderr } = spawnSync('npm', ['pack', '--dry-run'], {
    encoding: 'utf-8',
    cwd: path.join(__dirname, '..'),
  });
  const packedSize = /package size:\s+([0-9.]+ \w+)/gi.exec(stderr);
  const unpackedSize = /unpacked size:\s+([0-9.]+ \w+)/gi.exec(stderr);

  return {
    packed: packedSize[1],
    unpacked: unpackedSize[1],
  };
}

function writeNewFootprint({ packed, unpacked, limit }) {
  writeFileSync(
    FOOTPRINT_SNAPSHOT,
    JSON.stringify({ packed, unpacked, limit })
  );
}

const { packed: newPacked, unpacked: newUnpacked } = getCurrentFootprint();
const { packed, limit } = getLastReportedFootprint();

if (!limit) {
  console.warn('No package size limit is defined! Nothing to compare against.');
  console.log(
    chalk.bold(`New package size: ${newPacked} (Unpacked: ${newUnpacked})`)
  );
  writeNewFootprint({
    packed: newPacked,
    unpacked: newUnpacked,
    limit: newPacked,
  });
  console.log(`Wrote .footprint with limit = ${newPacked}`);

  process.exit(0);
}

const beforePacked = sizeStringToSize(packed);
const afterPacked = sizeStringToSize(newPacked);
const upperLimit = sizeStringToSize(limit);

if (beforePacked >= afterPacked && afterPacked <= upperLimit) {
  console.log(
    chalk.green(
      `Package size comparison: ${packed} >= ${newPacked}, limit = ${limit}`
    )
  );
} else if (beforePacked < afterPacked && afterPacked <= upperLimit) {
  console.warn(
    chalk.yellow(
      `Package size comparison: ${packed} < ${newPacked}, limit = ${limit}`
    )
  );
} else if (afterPacked > upperLimit) {
  console.log(
    chalk.red(
      `Package size comparison: ${packed} < ${newPacked}, LIMIT EXCEEDED: ${newPacked} > ${limit}\nUpdate the limit in .footprint.json or review your changes`
    )
  );
  process.exit(1);
}

process.exit(0);
