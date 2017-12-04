module.exports = (totalSize, req, res) => {
    const range = req.headers['range'];
    if (!range) {
        return {code: 200};
    }

    const sizes = range.match(/bytes=(\d*)-(\d*)/);  // 返回一个数组，数组的长度是3，第一个是匹配到的内容，第二个是第一个分组，第三个四第二个分组
    const end = sizes[2] || totalSize - 1;
    const start = sizes[1] || totalSize - end;

    if (start > end || start < 0 || end > totalSize) {
        return {code: 200};
    }

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Range', `bytes ${start}-${end}/${totalSize}`);
    res.setHeader('Content-Length', end - start);
    return {
        code: 206,
        start: parseInt(start),
        end: parseInt(end)
    }
}