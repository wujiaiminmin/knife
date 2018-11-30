const Router = require('koa-router');
const router = new Router();
// 导入userControl
const userControl = require('../control/UserControl');
// 导入articleControl
const articleControl = require('../control/ArticleControl');
// 导入CommentControl
const commentControl = require('../control/CommentControl');
// 导入 adminControl
const adminControl = require('../control/AdminControl');
// 导入 upload 
const upload = require('../util/upload');



// 设置主页路由
router.get('/', userControl.judgeLog, articleControl.getArtList);
/* router.get('/', userControl.judgeLog, async (ctx) => {
    await ctx.render('index', {
        "title": "这是博客的主页",
        'session': ctx.session
    });
}); */



// 设置用户注册登录的路由，
// 虽然这里有动态路由，但是不能这么做，因为他会劫持所有/user/*的路由
router.get(/^\/user\/(?=reg|login)/, async (ctx) => {
    const show = /reg$/.test(ctx.path);
    // 注意render是异步的，所以当前函数需要是async的，并且需要是await阻塞等待，页面才会被渲染出去
    await ctx.render('register',{ show });
})
// 设置注册的路由
router.post('/user/reg', userControl.reg);
// 设置登录的路由
router.post('/user/login', userControl.login);
// 设置退出的路由
router.get('/user/logout', userControl.logout)



// 设置去发表文章页面
router.get('/article', userControl.judgeLog, articleControl.addPage);
// 设置发表文章的路由
router.post('/article', userControl.judgeLog, articleControl.add);
// 请求文章列表分页 路由
router.get('/page/:id', userControl.judgeLog, articleControl.getArtList);



// 请求文章详情页 路由
router.get('/article/:id', userControl.judgeLog, articleControl.detail);
// 请求提交评论的 路由
router.post('/comment', userControl.judgeLog, commentControl.saveComment);



// 后台管理页面： 文章、评论、头像上传、用户管理页面
router.get('/admin/:id', userControl.judgeLog, adminControl.index);

// 后台 请求当前用户所有的文章
// 注意：这个路由是 admin-article.pug页面的table.on("tool(demo)", (obj) => {})监听函数发起的
router.get('/user/articles', userControl.judgeLog, adminControl.getCurrArtList);
// 在后台 根据Id删除文章
router.delete('/article/:id', userControl.judgeLog, adminControl.deleteOneArt);
// 后台 请求当前用户所有的评论
router.get('/user/comments', userControl.judgeLog, adminControl.getCurrCommList)
// 后台 根据Id删除评论
router.delete('/comment/:id', userControl.judgeLog, adminControl.deleteOneComm)
// 后台 请求用户管理
router.get('/user/users', userControl.judgeLog, adminControl.getAllUser);
// 管理员删除用户请求的路由
router.del('/user/:id', userControl.judgeLog, adminControl.delUserById)
// 上传文件
router.post('/upload', userControl.judgeLog, upload.single('file'), adminControl.uploadAvatar)




















// 配置 404 页面
router.get('*', async (ctx) => {
    await ctx.render('404',{
        title: '404'
    })
})


// 导出router模块app.js使用
module.exports = router;