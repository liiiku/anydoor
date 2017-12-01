const path = require('path');

const mimeTypes = {
    'css': 'text/css',
    // 'css': {
    //     text: 'text/css',
    //     icon: '图片路径'
    // },
    'gif': 'image/gif',
    'html': 'text/html',
    'ico': 'image/x-icon',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'text/javascript',
    'json': 'application/json',
    'pdf': 'application/pdf',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'swf': 'application/x-shockwave-flash',
    'tiff': 'image/tiff',
    'txt': 'text/plain',
    'wav': 'audio/x-wav',
    'wma': 'audio/x-ms-wma',
    'wmv': 'video/x-ms-wmv',
    'xml': 'text/xml'
};

module.exports = (filePath) => {
    let ext = path.extname(filePath)
        .split('.')
        .pop()
        .toLocaleLowerCase();  // jquery.min.js  pop数组最后一个
    
    if (!ext) {
        ext = filePath;
    }
    console.info(ext);
    return mimeTypes[ext] || mimeTypes['txt'];
}