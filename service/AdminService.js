// 导入文件系统 fs->FileSystem
const fs = require('fs');
const {
    join
} = require('path');


// 进入后台页面
exports.backStage = async (ctx) => {
    // 得到用户请求的id
    const id = ctx.params.id;
    const flag = false;

    // 遍历当前项目的后台文件名
    const arr = fs.readdirSync(join(__dirname, '../views/admin'));
    //  console.log(arr);
    // 循环比较
    arr.forEach((v, i) => {
        if (v === id) {
            flag = true;
        }
    })

    return flag;
}