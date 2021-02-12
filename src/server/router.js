const path = require('path');
const https = require('https');

const HttpRouter = require('./lib/HttpRouter');
const { sendFile, sendError } = require('./lib/responseHelpers');
const config = require('./config/config');

const API_PREFIX = '/api/v1';

const router = new HttpRouter();

router.set(
  '/', {
    method: HttpRouter.METHOD_GET,
    isExact: true,
  }, async (req, res) => {
    const pathToFile = path.join(config.publicFolder, '/index.html');
    await sendFile(req, res, pathToFile);
  },
);

router.set(
  `${API_PREFIX}/data`,
  {
    method: HttpRouter.METHOD_GET,
    isExact: true,
  },
  async (req, res) => {
    const dataUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
    const apiRequest = https.request(dataUrl, (apiResponse) => {
      apiResponse.pipe(res);
    });

    apiRequest.on('error', (err) => {
      console.error(err);
      sendError(500);
    });

    apiRequest.end();
  },
);

module.exports = router;
