const ArticleModel = require('../model/ArticleModel');
const Article = require('../domain/Article');
const ArticleDao = require('../dao/ArticleDao');
// 导入 userService
const userService = require('../service/UserService');
// 导入 commentService
const commentService = require('../service/CommentService');


// 在后台 用户根据文章的Id删除文章
exports.deleteById = async (article) => {
    // 删除文章——>该用户的articleNum-1——>文章所有的评论删出，每一条评论对应用户的commentNum-1
    const res = await ArticleDao.deleteById(article.id);
    // 如果文章删除成功
    if(res){
        // 需要把该用户的articleNum-1
        if(article.ctx){
            await userService.addArticleNum(article.ctx.session.uid, -1);
        }
        // 需要把这篇文章对应的所有评论删除，同时每一条评论对应的用户的comment-1
        // 根据文章的id删除所有的评论
        // console.log('article.id= ' + article.id);
        
        await commentService.deleteByArtid(article.id);
        return res;
    }
}

// 在后台得到当前用户所有的文章列表
exports.getCurrArtList = async (author) => {
    const res = await ArticleDao.getCurrArtList(author);
    return res;
}

// 更新文章的评论计数器
exports.addCommentNum = (id, num) => {
    ArticleDao.addCommentNum(id, num);
    // console.log('文章的评论计数器更新ok');
    
}

// 根据文章id获取文章对象
exports.findById = async (id) => {
    const article = await ArticleDao.findById(id);
    return article;
}

// 获取文章列表
exports.getArtList = async (page) => {
    const artList = await ArticleDao.getArtList(page);
    return artList;
}

// 获取文章列表总数
exports.getArtCounts = async () => {
    const maxNum = ArticleDao.getArtCounts()
    return maxNum;
}

// 保存文章
exports.addArticle = async (data) => {
    const opt = {
        tips: data.tips,
        title: data.title,
        content: data.content,
        commentNum: 0,
        author: data.ctx.session.uid
    }
    // 创建文章数据对象
    const article = new Article(opt);
    const articleModel = new ArticleModel(article);
    // 调用ArticleDao保存articleModel文档实例
    const res = await ArticleDao.save(articleModel);

    // 更新用户发表文章的计数器
    if(!res) return res;
    userService.addArticleNum(data.ctx.session.uid, 1);

    return res;
}
