const path = require('path');
const { readFile } = require('./fileSystem');

function sendJSON(res, data) {
  const body = JSON.stringify((data));

  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': body.length,
    'Cache-Control': 'no-store, max-age=0',
  };

  res
    .writeHead(200, headers)
    .end(body);
}

async function sendFile(req, res, pathToFile) {
  try {
    const { readStream, stats, mimetype } = await readFile(pathToFile);

    const headers = {
      'Content-Type': mimetype,
      'Content-Length': stats.size,
    };

    res.writeHead(200, headers);

    readStream.pipe(res);
  } catch (err) {
    console.error(`Error while trying to send file ${pathToFile}: ${err}`);
  }
}

async function sendFileAttachment(req, res, pathToFile) {
  try {
    const { readStream } = await readFile(pathToFile);

    const headers = {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${path.basename(pathToFile)}`,
    };

    res.writeHead(200, headers);

    readStream.pipe(res);
  } catch (err) {
    console.error(`Error while trying to send file attachment ${pathToFile}: ${err}`);
  }
}

function sendError(res, code) {
  res.writeHead(code).end();
}

module.exports = {
  sendJSON,
  sendFile,
  sendFileAttachment,
  sendError,
};
