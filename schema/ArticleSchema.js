const { Schema } = require('../connectdb/config');
const { ObjectId } = require('mongoose');

// 创建ArticleSchema集合约束
const ArticleSchema = new Schema(
    {
        tips: String, // 文章类别
        title: String, // 文章标题
        content: String, // 文章内容
        commentNum: Number, // 评论数量
        author:{
            type: ObjectId, // users表的id唯一关联  
            ref: 'users' // 关联的表
        } // 作者 ，关联users表
    }, 
    {
        versionKey: false,
        timestamps: {
            createdAt: 'created'
        }
    }
);



module.exports = ArticleSchema;
