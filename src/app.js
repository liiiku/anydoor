const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/defaultConfig'); 
const route = require('./helper/route');

const server = http.createServer((req, res) => {
    const url = req.url;
    const filePath = path.join(conf.root, url);
    route(req, res, filePath);
});

server.listen(conf.port, conf.hostname, () => {
    const addr = `http://${conf.hostname}:${conf.port}`;
    console.info(`Server started at ${chalk.green(addr)}`);
});