/**
 * 第一个参数：知道自己压缩什么
 * 第二个参数：要知道客户端也就是浏览器支持哪几种压缩类型，在request-headers中声明的
 * 第三个参数：要告诉浏览器我是通过什么方式进行的压缩，方便浏览器进行解压
 * 
 * 有两种情况是不能压缩的:
 * 浏览器声明了，不支持任何压缩方式，拿不到信息，或者是，拿到的呢，服务器不支持
 */
const {createGzip, createDeflate} = require('zlib');

module.exports = (rs, req, res) => {
    const acceptEncoding = req.headers['accept-encoding'];
    if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)) { // 为什么用单词边界，防止服务器传回来gzip5，这样的
        return rs;
    } else if (acceptEncoding.match(/\bgzip\b/)) {
        res.setHeader('Content-Encoding', 'gzip');
        return rs.pipe(createGzip());  // 深入理解流才能明白为什么这样就可以压缩了
    } else if (acceptEncoding.match(/\bdeflate\b/)) {
        res.setHeader('Content-Encoding', 'deflate');
        return rs.pipe(createDeflate());
    }
};