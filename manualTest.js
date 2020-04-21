const DataDog = require('./server/lib/datadog');

const datadog = new DataDog('US', process.env.DATADOG_API_KEY, 'env:dev,service:auth0');
const cb = () => 'hi';

const sampleLog = {
	"_id": "1",
	"date": "2020-04-20T16:28:18.935Z",
	"type": "sapi",
	"description": "Update a client",
	"connection": null,
	"connection_id": "",
	"client_id": "123",
	"client_name": "",
	"ip": "",
	"client_ip": null,
	"user_agent": "Other 0.0.0 / Other 0.0.0",
	"details": {
		"request": {
			"method": "patch",
			"path": "/api/v2/clients/123",
			"query": {},
			"userAgent": null,
			"body": {
				"name": "test",
			}
		},
		"response": {
			"statusCode": 200,
			"body": {
				"client_secret": "REDACTED",
				"name": "test",
				"client_id": "123"
			}
		}
	}
};

datadog.log(sampleLog, cb);
