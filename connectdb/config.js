/**
 * 连接数据库 导出 db schema
 */
const mongoose = require('mongoose');
const db = mongoose.createConnection('mongodb://localhost:27017/knife', {useNewUrlParser: true});

// 连接数据库监听
db.on('erro', ()=>{
    console.log('knife 数据库连接失败');
});
db.on('open', ()=>{
    console.log('knife 数据库连接成功');
});

// 用ES6的 Promise 代替mongoose自实现的 Promise
mongoose.Promise = global.Promise;

// 把mongoose的 schema取出来
const Schema = mongoose.Schema;


module.exports = {
    db,
    Schema
}

