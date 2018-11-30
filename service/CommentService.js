const CommentModel = require('../model/CommentModel');
const CommentDao = require('../dao/CommentDao');
// 引入 UserService
const userService = require('../service/UserService');
// 引入 ArrticleSeervice
const articleService = require('../service/ArticleService');



// 在后台 根据用户的id删除所有的评论
exports.delAllByUId = async (userId) => {
    // 根据用户的Id得到该用户的所有评论
    const commentList = await this.getCommentByUid(userId);
    // console.log('当前用户的所有评论：' +  commentList);
    
    // 循环删除当前用户的所有评论，并且把每条评论对应的文章commentNum-1
    commentList.forEach((comment) => {
        // 根据评论Id删除评论
        CommentDao.deleteByCommId(comment._id);
        // 把当前这条评论对应文章的commentNum-1
        articleService.addCommentNum(comment.article, -1);
    })
}

// 根据评论的id查询出评论对象
exports.getComByComid = async (id) => {
    const comment = CommentDao.getComByComid(id);
    return comment;
}

// 在后台 根据评论的id删除评论
exports.deleteOneComm = async (comment) => {

    // 首先应该查询出这条评论
    comment = await this.getComByComid(comment.commentId);

    // console.log(comment);
    
    if(!comment) return null;

    // 删除评论
    const res = await CommentDao.deleteByCommId(comment._id);
    if(!res) return null;

    // 该评论对应的用户commentNum-1
    await userService.addCommentNum(comment.from, -1);

    // 该评论对应的文章commentNum-1
    await articleService.addCommentNum(comment.article, -1);

    return res;
    
}

// 在后台 根据用户的id，得到该用户的所有评论
exports.getCommentByUid = async (from) => {
    const commentList = await CommentDao.getCommentByUid(from);
    return commentList;
}

// 根据评论的id删除该条评论
exports.deleteByCommId = async (commentId) => {
    CommentDao.deleteByCommId(commentId);
}

// 用户在后台 根据文章的id删除这篇文章对应所有的评论
exports.deleteByArtid = async (articleId) => {
    // 查询出这篇文章所以的评论
    const commentList = await this.getCommentById(articleId);
    // console.log('每篇文章对应的所有评论' + commentList);
    
    // 循环删除每一个评论，并且把评论对应用户的commentNum-1
    commentList.forEach((comment) => {
        // 根据评论的id删除该条评论
        this.deleteByCommId(comment._id);
        // console.log('this是：' + this.deleteByCommId);
        // 评论对应用户的commenNum-1
        if(comment.from){ 
            // 如果这篇文章对应的用户存在，前提是还没有被删除，
            // 因为nodejs操作IO是异步的,同步代码先执行，异步代码谁耗时少谁就先出来。
            userService.addCommentNum(comment.from._id, -1);
        }
        // console.log(comment.from._id +"  "+comment._id);
    });

    /* 删除用户每一篇文章对应的所有评论时 ——> 查询出来当前这篇文章的所有评论
    { 
        _id: 5bff513510f54643707c9bce,
        content: 'dasd',
        article: 5bff50e910f54643707c9bca,
        from:{ 
            avatar: '/avatar/default.jpg',
            _id: 5bff4ef710f54643707c9bc2,
            username: 'admin' 
        },
        created: 2018-11-29T02:38:45.628Z,
        updatedAt: 2018-11-29T02:38:45.628Z 
    },
    {
        _id: 5bff510710f54643707c9bcb,
        content: 'dfsf',
        article: 5bff50e910f54643707c9bca,
        // 这里应该是用户被删除了，在查询文章对应的所有评论的时候，
        // 没有查询到用户的信息，所以用户的删除应该放在这后面来做。
        // 否则就需要在给用户commentNum-1时候加上一个判断，否则找不到人报错
        from: null, 
        created: 2018-11-29T02:37:59.875Z,
        updatedAt: 2018-11-29T02:37:59.875Z 
    }
    5bff4ef710f54643707c9bc2  5bff513510f54643707c9bce
    */
    
}
 
// 根据文章的id查找所有的评论信息
exports.getCommentById = async (article) => {
    const commentList = await CommentDao.getCommentById(article);
    return commentList;
}

// 保存评论，并且需要把文章的评论数量和用户的评论数量+1
exports.saveComment = async (data) => {

    // 如果对象没有登录，不可以保存
    if(!data.ctx.session.username) return null;
    
    // 保存评论
    const content = data.content; // 得到评论的内容
    const article = data.article; // 得到文章的id
    const from = data.ctx.session.uid; // 得到评论人的id
    // 组织opt对象
    const opt = {
        content,
        article,
        from
    }
    // 构建Comment文档实例
    const commentModel = new CommentModel(opt);
    // 调用CommentDao保存评论
    const comment = await CommentDao.save(commentModel);
    if(!comment) return null; // 保存不成功

    // 保存成功的话：users.CommentNum+1, articles.CommentNum+1
    userService.addCommentNum(from, 1);
    articleService.addCommentNum(article, 1);

   





    return comment;
}
