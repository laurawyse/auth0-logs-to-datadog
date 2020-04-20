const tls = require('tls');
const logger = require('./logger');
var r = require('request-promise');

const metadata = {
  ddsourcecategory: 'external',
};

const config = {};

function DataDog(server, apiKey, customTags) {
  if (!apiKey) {
    throw new Error('API Key is required for DataDog.');
  }

  config.apiKey = apiKey;

  if (server === 'US') {
    config.host = 'http-intake.logs.datadoghq.com';
  } else {
    config.host = 'http-tcp-intake.logs.datadoghq.eu';
  }

  if (customTags) {
    const matchedTags = customTags.match(/([^:|^,\W]+):([^,|^\W]+)/g);
    if (!matchedTags || matchedTags.length < 1) {
      throw new Error('Custom tags are not formatted properly. Format is comma-separated key:value.');
    }

    metadata.ddtags = customTags;
  }
}

DataDog.prototype.log = (log, callback) => {
  // // Merge the metadata with the log and remove date if present
  const merge = Object.assign(metadata, log, { date: undefined });

  var options = {
    method: 'POST',
    uri: `https://${config.host}/v1/input/`,
    qs: {
      ddsource: 'auth0',
      service: 'auth0'
    },
    headers: {
      'DD-API-KEY': config.apiKey,
      'Content-Type': 'application/json'
    },
    body: merge,
    json: true
  };

  return r(options)
    .then(r => {
      return callback();
    })
    .catch(e => {
      logger.info(`Error sending logs to datadog: ${e.message}`);
      return callback();
    });
};

module.exports = DataDog;
