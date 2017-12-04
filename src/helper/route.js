const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
// const config = require('../config/defaultConfig');
const mime = require('../helper/mime');
const compress = require('../helper/compress');
const range = require('./range');
const isFresh = require('./cache');

const tplPath = path.join(__dirname, '../template/dir.tpl'); // 用绝对路径，防止在不同路径启动，路径会出错
const source = fs.readFileSync(tplPath); // 这里用同步方法的前提是：下面的东西想要工作，必须等待这个结果，template每次用的是一样的，不用每次请求来都读一次, 读文件默认读的buffer
const template = Handlebars.compile(source.toString());

module.exports = async function (req, res, filePath, config) {
    try {
        const stats = await stat(filePath);
        if (stats.isFile()) {
            const contentType = mime(filePath);
            res.setHeader('Content-Type', contentType);

            if (isFresh(stats, req, res)) {
                res.statusCode = 304;
                res.end();
                return;
            }

            let rs;
            const {code, start, end} = range(stats.size, req, res);
            if (code === 200) {
                res.statusCode = 200;
                rs = fs.createReadStream(filePath);
            } else {
                res.statusCode = 206;
                rs = fs.createReadStream(filePath, {start, end})
            }
            if (filePath.match(config.compress)) {
                rs = compress(rs, req, res);
            }
            rs.pipe(res);
        } else if (stats.isDirectory()) {
            const files = await readdir(filePath);  // 不加await，返回的是一个promise对象
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');  // 如果是文件夹，肯定要用html展示，所以这里这样写死即可
            const dir = path.relative(config.root, filePath);
            const data = {
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : '',
                files: files.map(file => {
                    return {
                        file,
                        icon: mime(file)
                    }
                })  // es6写法，属性名和属性值一样的时候，files: files
            };
            res.end(template(data));
        }
    } catch(ex) {
        console.error(ex);
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${filePath} is not a directory file`);
    }
}