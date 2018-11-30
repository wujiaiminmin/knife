const ArticleModel = require('../model/ArticleModel');


// 后台根据文章的Id删除文章
exports.deleteById = async (articleId) => {
    const res = await ArticleModel.deleteOne({'_id' : articleId});
    // console.log('删除文章的返回结果：' + typeof res); // object
    return res;
}

// 后台获取当前用户的所有文章数
exports.getCurrArtList = async (author) => {
    const data = await  ArticleModel
        .find({'author': author})
        .sort('created')
        .then(data => data)
        .catch(err => console.log(err));

    // console.log(data);
    
    return data;
    
}

// 更新文章的评论计数器
exports.addCommentNum = (id, num) => {
    ArticleModel.updateOne(
        {
            '_id': id}, 
            {$inc: {'commentNum': num}
        },
        (err) => {
            if(err) return console.log(err);
            // console.log('文章的评论计数器更新成功！');
        }
    )
}

// 根据Id获取文章
exports.findById = async (id) => {
    const article = await ArticleModel.findById(id);
    // console.log(article); // 是一个单纯的文章对象
    return article;
}

// 获取文章列表
exports.getArtList = async (page) => {
    const artList = await ArticleModel
        .find()
        .sort('-created') // 根据创建时间倒序
        .skip(5 * page) // 从第几条开始
        .limit(5) // 每一页显示几条
        .populate({
            // 关联查询
            path: 'author', // 关联的字段
            select: '_id username avatar'
        }) // mongoose 用于连表查询的API
        .then(data => data) // 成功——>返回值
        .catch(err => {console.log(err)} // 失败——>打印错误信息
        )
    return artList;
}

// 获取列表总数
exports.getArtCounts = async () => {
    const maxNum = await ArticleModel.estimatedDocumentCount((err, num) => {
        err ? console.log(err) : num;
    });
    // console.log(maxNum);
    return maxNum;
}

// 保存文档对象
exports.save = async (instance) => {
    let res = null;
    await new Promise((resolve, reject) => {
        instance.save((err, data) => {
            err && reject(err);
            data && resolve(data);
        })
    })
    .then((data) => {
        data && (res = data);
    })
    .catch((err) => {
        err && console.log(err);
    })
    return res;
}