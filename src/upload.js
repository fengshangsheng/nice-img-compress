import https from 'https';

const domainUrl = ["tinyjpg.com", "tinypng.com"];

function randomPostHeader() {
  const randomIdx = Math.round(Math.random());
  const ip = new Array(4)
    .fill(0)
    .map(() => parseInt(Math.random() * 255))
    .join(".");

  return {
    headers: {
      'Cache-Control': 'no-cache',
      "Content-Type": "application/x-www-form-urlencoded",
      "Postman-Token": Date.now(),
      "X-Forwarded-For": ip,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
    },
    hostname: domainUrl[randomIdx],
    method: 'POST',
    path: '/web/shrink',
    rejectUnauthorized: false
  };
}

function index(file) {
  const header = randomPostHeader();

  return new Promise((resolve, reject) => {
    const req = https.request(
      header,
      res => {
        res.on("data", data => {
          const obj = JSON.parse(data.toString());
          if (obj.error) {
            reject(obj.message);
          } else {
            resolve(obj);
          }
        })
      }
    );
    req.write(file, "binary");
    req.on("error", e => reject(e));
    req.end();
  });
}

module.exports = index
