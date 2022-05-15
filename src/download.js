const url = require("url");
const https = require("https");

function index(path) {
  const options = new url.URL(path);

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding('binary');
      let file = '';
      res.on('data', chunk => {
        file += chunk
      });
      res.on('end', () => {
        resolve(file)
      });
    });
    req.on('error', (error) => {
      reject(error);
    });
    req.end();
  });
}

module.exports = index
