const { Schema } = require('../connectdb/config');
const { ObjectId } = require('mongoose');

// 创建ArticleSchema集合约束
const CommentSchema = new Schema(
    {
        content: String, // 评论内容
        article:{ // 哪一篇文章
            type: ObjectId, // articles表的id唯一关联  
            ref: 'articles' // 关联的表
        }, // 文章，关联articles表
        from:{ // 谁评论的
            type: ObjectId, // users表的id唯一关联  
            ref: 'users' // 关联的表
        } // 评论者 ，关联users表
    }, 
    {
        versionKey: false,
        timestamps: {
            createdAt: 'created'
        }
    }
);



module.exports = CommentSchema;
