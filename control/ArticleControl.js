const articleService = require('../service/ArticleService');
// 导入 commentControl
const commentService = require('../service/CommentService');


// 文章详情页
exports.detail = async (ctx) => {
    // 获取文章的_id
    const _id = ctx.params.id;
    
    // 根据id查询文章
    const article = await articleService.findById(_id);

    // 根据文章的id找到这篇文章相关的所有评论列表【评论人和评论内容】
    const comment = await commentService.getCommentById(_id);

    // 渲染到文章详情页面
    await ctx.render('article', {
        session: ctx.session,
        title: article.title,
        article,
        comment
    })
}



// 获取文章列表
exports.getArtList = async (ctx) => {

    // 获取文章总数
    const maxNum = await articleService.getArtCounts();

    // 得到参数第几页， 如果默认打开的首页就是1
    let page = ctx.params.id || 1;
    page--;
    // 调用service获取文章列表
    const artList = await articleService.getArtList(page);

    // console.log('返回的文章数：' + artList.length);
    

    // console.log(ctx.session);
    

    await ctx.render('index', {
        'session': ctx.session,
        artList, // 文章列表对象
        maxNum, // 总的文章数量
        'title': '博客的主页'
    });
}


// 请求到发表文章页面
exports.addPage = async (ctx) => {
    await ctx.render('add-article', {
        title: '文章发表',
        session: ctx.session
    });
}

// 发表文章
exports.add = async (ctx) => {
    // 判断是否登录
    if(ctx.session.isNew){
        return ctx.body = {
            status: 0,
            msg: '用户未登录'
        }
    }

    // 用户登录
    // 得到数据
    const data = ctx.request.body;
    data.ctx = ctx;
    // 调用articleService保存文章
    const res = await articleService.addArticle(data);
    if(res){
        return ctx.body = {
            status: 1,
            msg: '文章保存成功'
        }
    } else {
        return ctx.body = {
            status: 0,
            msg: '文章保存失败'
        }
    }


}