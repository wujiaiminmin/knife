const multer = require('koa-multer');
const { join } = require('path');

// 定义随机数函数
function random() {
    return Math.floor(Math.random() * 10000);
}

// 配置文件存储地址和文件名确定
const storage = multer.diskStorage({
    // 文件存储的位置
    destination : join(__dirname, '../public/avatar'),

    // 重置文件名
    filename(req, file, cb){
        const filename = file.originalname.split('.'); // 从上传文件file对象中获取原始文件名并切割
        // 执行回调
        cb(null,  `${Date.now() + random()}.${filename[filename.length -1]}`);
    }
})

// 导出 multer
module.exports = multer({storage});