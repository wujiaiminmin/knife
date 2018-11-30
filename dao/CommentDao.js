const CommentModel = require('../model/CommentModel');


// 根据评论的id得到评论对象
exports.getComByComid = async (commentId) => {
    const comment = await CommentModel.findById(commentId);
    // console.log('根据评论id得到评论对象是：' + comment);
    return comment;
}

// 根据用户id得到所有的评论
exports.getCommentByUid = async (from) => {
    const commentList = await CommentModel
        .find({'from' : from })
        .sort('created')
        .populate({
            path: 'article',
            select: 'title' 
        })
        .then(data => data)
        .catch(err => console.log(err));

    // console.log(commentList);
    return commentList;
    

}

// 根据评论的Id删除评论
exports.deleteByCommId = async (commentId) => {
    const res = await CommentModel.deleteOne({'_id' : commentId});
    // console.log('根据评论的id删除品论结果是：' + res); 
    return res;
}

// 根据文章的id查找评论列表
exports.getCommentById = async (article) => {
    const commentList = await CommentModel
        .find({'article': article})
        .sort('-created')
        // .skip()
        // .limit()
        .populate({
            path: 'from',
            select: 'avatar username'
        })
        .then(data => data)
        .catch(err => console.log(err)); 
    return commentList;
}

// 保存评论
exports.save = async (instance) => {

    let comment = null;

    await new Promise((resolve, reject) => {

        instance.save((err, data) => {
            err && reject(err);
            data && resolve(data);
        })
    })
    .then((data) => {
        comment = data;
    })
    .catch((err) => {
        console.log(err);
    })

    // console.log(comment);

    return comment;
    
    /* 
    let comment = null;
    await instance.save((err, data) => {
        err && console.log(err);
        data && (comment = data);
        console.log(comment); // 保存的评论对象
    });
    return comment; // null 这就说明了异步 
    */
}


