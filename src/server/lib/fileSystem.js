const fs = require('fs');
const util = require('util');
const path = require('path');
const childProcess = require('child_process');

const execFile = util.promisify(childProcess.execFile);
const config = require('../config/config');

async function readFile(pathToFile) {
  let getMimetypeResult = null;
  let stats = null;
  let mimetype = '';

  if (pathToFile.endsWith('.html')) {
    mimetype = 'text/html';
  } else if (pathToFile.endsWith('.js')) {
    mimetype = 'text/javascript';
  } else if (pathToFile.endsWith('.css')) {
    mimetype = 'text/css';
  } else {
    getMimetypeResult = await execFile('file', ['-b', '--mime-type', pathToFile]);

    if (getMimetypeResult) {
      mimetype = getMimetypeResult.stdout.replace(/\n/, '');
    }
  }

  try {
    stats = await fs.promises.stat(pathToFile);
  } catch (err) {
    console.dir({ err });
    if (err.code === 'ENOENT') {
      console.log('Cannot find requested file');
    } else {
      throw new Error(err);
    }
  }

  if (stats == null) {
    return null;
  }

  return {
    readStream: fs.createReadStream(pathToFile),
    stats,
    mimetype,
  };
}

async function findStaticFile(input) {
  const safeSuffix = path.normalize(input).replace(/^(\.\.(\/|\\|$))+/, '');
  const pathToFile = path.join(config.publicFolder, safeSuffix);
  let stats = null;

  try {
    stats = await fs.promises.stat(pathToFile);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`File ${pathToFile} not found`);
    } else {
      throw err;
    }
  }

  if (stats && stats.isFile()) {
    return {
      pathToFile,
      stats,
    };
  }

  return null;
}

module.exports = {
  readFile,
  findStaticFile,
};
