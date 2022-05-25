const fs = require('fs');
const path = require("path");
const download = require('./src/download')
const upload = require('./src/upload')
const byteTransform = require('./src/uitls/byteTransform');
const color = require('./src/uitls/chalk')

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
      const msg = color.success('压缩完成');
      console.log(msg);
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

        const before = color.warn(byteTransform(uploadData.input.size));
        const after = color.success(byteTransform(uploadData.output.size));

        console.log(`${absolutePath}: ${before} => ${after}`);

        resolve()
      } catch (e) {
        reject();
      }
    })
  }

  getAssetsImgPath(assets) {
    const list = Object.entries(assets)
      .map((item) => {
        return path.parse(item[0]);
      })
      .filter((item) => {
        const {name, ext, base} = item;
        return /^(.png|.jpg)/.test(ext)
      })
      .map((item) => {
        return path.join(item.dir, item.base).split('?')[0]
      })

    return list;
  }
}

module.exports = CompressImgPlugin;
