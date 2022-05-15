import fs from 'fs';
import ora from 'ora';
import path from 'path';
import chalk from 'chalk';
// const fs = require('fs');
// const path = require("path");
// const ora = require('ora')
// const chalk = require('chalk');

const download = require('./src/download')
const upload = require('./src/upload')

class CompressImgPlugin {
  compilation = null;
  compiler = null;

  constructor() {
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('CompressImgPlugin', (compilation, cb) => {
      this.compilation = compilation;
      this.compiler = compiler;

      this.init();
    })
  }

  async init() {
    const imgPath = this.getAssetsImgPath(this.compilation.assets);
    const pormise = [];

    imgPath.forEach((item) => {
      const absolutePath = path.join(this.compiler.outputPath, item);
      pormise.push(this.initCompress(absolutePath));
    });

    Promise.allSettled(pormise).then((data) => {
      console.log('压缩完成',data);
    });
  }

  // 开始压缩
  async initCompress(absolutePath) {
    return new Promise(async (resolve, reject) => {
      try {
        const beforeFile = fs.readFileSync(absolutePath, "binary");
        const uploadData = await upload(beforeFile);
        const afterFile = await download(uploadData.output.url);
        fs.writeFileSync(absolutePath, afterFile, "binary");
        console.log(`${parseInt(uploadData.input.size / 1024)}kb ==> ${parseInt(uploadData.output.size / 1024)}px`);
        resolve()
      } catch (e) {
        reject();
      }
    })
  }

  getAssetsImgPath(assets) {
    return Object.entries(assets)
      .filter((item) => {
        return /(.png|.jpg)$/.test(item[0]);
      })
      .map((item) => item[0])
  }
}

module.exports = CompressImgPlugin;




/*
import Fs from 'fs';
import Path from 'path';
import Chalk from 'chalk';
import Figures from 'figures';
import Https from 'https';
import httpUrl from 'url';

import Ora from 'ora';

async function compressImg(path) {
  try {
    const file = Fs.readFileSync(path, "binary");
    const obj = await uploadImg(file);
    const data = await downloadImg(obj.output.url);

    const oldSize = Chalk.redBright(parseInt(obj.input.size / 1024) + 'KB');
    const newSize = Chalk.greenBright(parseInt(obj.output.size / 1024) + 'KB');

    const dpath = Path.join("img", Path.basename(path));
    const msg = `${Figures.tick} Compressed [${Chalk.yellowBright(path)}] completed: Old Size ${oldSize}, New Size ${newSize}`;

    Fs.writeFileSync(dpath, data, "binary");
    return Promise.resolve(msg);
  } catch (err) {
    const msg = `${Figures.cross} Compressed [${Chalk.yellowBright(path)}] failed: ${Chalk.redBright(err)}`;
    return Promise.resolve(msg);
  }
}

const TINYIMG_URL = [
  "tinyjpg.com",
  "tinypng.com"
];

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
    hostname: TINYIMG_URL[randomIdx],
    method: 'POST',
    path: '/web/shrink',
    rejectUnauthorized: false
  };
}

function uploadImg(file) {
  const header = randomPostHeader();
  return new Promise((resolve, reject) => {
    const req = Https.request(header, res => {
      res.on("data", data => {
        const obj = JSON.parse(data.toString());
        obj.error ? reject(obj.message) : resolve(obj);
      })
    });
    req.write(file, "binary");
    req.on("error", e => reject(e));
    req.end();
  });
}

function downloadImg(url) {
  const options = new httpUrl.URL(url);

  return new Promise((resolve, reject) => {
    const req = Https.request(options, (res) => {
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


(async () => {
  // console.log('__dirname', Path.resolve());
  // console.log(Path.resolve(__dirname));
  // Fs.readdir('./img',(er,data)=>{
  //   console.log('data', data);
  // })

  // const spinner = Ora("Image is compressing......").start();
  // const res = await compressImg("img/modal-bg2.png");
  // spinner.stop();
  // console.log('res', res);
})();
*/
