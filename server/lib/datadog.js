const tls = require('tls');

const metadata = {
  ddsourcecategory: 'external',
  ddsource: 'auth0'
};

const config = {};

function DataDog(server, apiKey, customTags) {
  if (!apiKey) {
    throw new Error('API Key is required for DataDog.');
  }

  config.apiKey = apiKey;

  if (server === 'US') {
    config.host = 'intake.logs.datadoghq.com';
    config.port = 10516;
  } else {
    config.host = 'tcp-intake.logs.datadoghq.eu';
    config.port = 443;
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
  const socket = tls.connect(config.port, config.host, () => {
    if (!socket.authorized) {
      return callback('Error connecting to DataDog');
    }

    // Merge the metadata with the log
    const merge = Object.assign(metadata, log);

    console.log('sending log to datadog: ');
    console.log(JSON.stringify(merge));
    console.log(`apiKey starts with "${config.apiKey.charAt(0)}", ends with "${config.apiKey.charAt(config.apiKey.length-1)}"`)
    
    socket.write(`${config.apiKey} ${JSON.stringify(merge)}\r\n`);
    socket.end();

    return callback();
  });
};

module.exports = DataDog;
