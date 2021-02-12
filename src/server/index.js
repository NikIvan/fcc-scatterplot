const http = require('http');

const router = require('./router');
const { findStaticFile } = require('./lib/fileSystem');
const { sendFile } = require('./lib/responseHelpers');
const { PORT, HOSTNAME } = require('./constants');

const server = http.createServer(async (req, res) => {
  const isAvailableMethod = router.getAvailableMethods().includes(req.method);

  if (!isAvailableMethod) {
    res.writeHead(405, {
      Allow: Object.keys(router).join(', '),
    });
    return res.end();
  }

  const matchedHandler = router.match(req.method, req.url);
  if (matchedHandler) {
    matchedHandler(req, res);
    return null;
  }

  try {
    const file = await findStaticFile(req.url);

    if (file) {
      await sendFile(req, res, file.pathToFile);
      return null;
    }
  } catch (err) {
    console.error(err);
  }

  res.writeHead(404);
  res.end();

  return null;
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http:// ${HOSTNAME}:${PORT}/`);
});
