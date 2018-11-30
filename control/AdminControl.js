const adminService = require('../service/AdminService');
// 导入 articleService对象
const articleService = require('../service/ArticleService');
// 导入 commentService对象
const commentService = require('../service/CommentService');
// 引入文章domain对象
const Article = require('../domain/Article');
// 引入 Comment domain对象
const Comment = require('../domain/Comment');
// 导入 userService
const userService = require('../service/UserService');
// 引入 checkLog
const checkLog = require('../util/checkLog');
// 导入 User
const User = require('../domain/User');



// 用户上传头像
exports.uploadAvatar = async (ctx) => {
    // 得到修改后的文件名
    const filename = ctx.req.file.filename;
    // console.log('上传头像的新文件名是：' + filename);
    // 修改该用户在数据库中的头像路径
    let user = new User({id : ctx.session.uid, avatarUrl : '/avatar/'+filename});
    const res = await userService.updateAvatar(user);
    // console.log('用户头像路径更改的返回值是：' + res);
    
    if(res){
        // 修改session中的头像路径
        ctx.session.avatar = user.avatarUrl;
        ctx.body = {
            message: '上传成功'
        }
    } else {
        ctx.body = {
            message: '上传失败'
        }
    }
}


/**
 * 删除用户总结：
 *  1. 删除用户自己主动的评论，并且需要把每条评论对应文章的commentNum-1
 *  2. 删除用户发表的所有文章，每篇文章对应的所有评论，每条评论对应的人的commentNum-1.
 *      注意：因为NodeJs操作IO是异步的，所以处理评论对应人的commentNUm-1的时候，
 *           需要注意一下自己对自己文章的评论也会给自己的commentNum-1，如果这个时候如果
 *           异步的删除自己的Io操作已经完成，就会报null了，给自己的commentNum-1，但是找不到人了。
 *           但是先把自己主动的评论删除的话就不会这样了。
 *           Nodejs的异步IO操作时谁先执行完谁就可以先返回值。删除自己很快，循环删除每条评论和处理
 *           评论人的commentNum-1很耗时间的，随意慢了。
 */
// 管理员 删除用户
exports.delUserById = async (ctx) => {
    // 首先是要判断用户是否登录了
    checkLog(ctx);

    // 得到删除用户的id
    const userId = ctx.params.id;

    /* 分析：
            1.删除他自己所有的评论
            2.删除一个用户 ——> 删除该用户下面的所有文章 ——> 删除每篇文章对应的所有评论 
    */

    // 1. 根据用户的Id删除该用户所有的评论，并且把每条评论对应文章的commentNum-1
    commentService.delAllByUId(userId);
    
    // 2. 删除该用户
    const res = await userService.delByUserId(userId);

  //  console.log('AdminControl请求删除用户的结果：' + res);
    
    if(res){
        ctx.body = {
            state: 1,
            message: '用户删除成功'
        };
    } else {
        ctx.body = {
            state: 0,
            message: '用户删除失败'
        }
    }

}

// 后台 请求所有的用户
exports.getAllUser = async (ctx) => {
    // 首先是要判断用户是否登录了
    if(ctx.session.isNew){
        ctx.status = 404;
        return await ctx.render('404', {title: '404'})
    }

    const userList = await userService.getAllUser();
    // console.log(userList);

    /*  
        注意： 在后台请求用户的文章、用户的评论、所有用户列表，其返回值字段变量是：code、count、data
                这3个字段变量是layui规范的。
                table.on("tool(demo)", (obj) => {} 在这个table组件中规定的。

    */

    let res = {
        code: 0,
        count: userList.length,
        data: userList
    }
    // 给pug页面返回值
    ctx.body = res;
}

// 在后台根据Id删除评论
exports.deleteOneComm = async (ctx) => {

    // 首先是要判断用户是否登录了
    if(ctx.session.isNew){
        ctx.status = 404;
        return await ctx.render('404', {title: '404'})
    }

    const commentId = ctx.params.id;
    let comment = new Comment({commentId, ctx});
    // console.log(comment)
    const res = await commentService.deleteOneComm(comment);
    // console.log(res);
    
    // 给admin-comment.pug返回值
    let msg = {
        state: 1, // 默认成功
        message: '删除评论成功'
    }
    if(!res){
        msg.state = 0,
        msg.message = '删除评论失败'
    }
    ctx.body =  msg;
}

// 在后台 得到当前用户所有的评论
exports.getCurrCommList = async (ctx) =>{

    // 首先是要判断用户是否登录了
    if(ctx.session.isNew){
        ctx.status = 404;
        return await ctx.render('404', {title: '404'})
    }

    const commentList = await commentService.getCommentByUid(ctx.session.uid);
    
    // 传递给admin-comment.pug页面
    if(commentList){
        ctx.body = {
            code: 0,
            count: commentList.length,
            data: commentList
        };  
    } else {
        ctx.body = {
            code: 0,
            count: 0,
            data: []
        }; 
    }
}

// 在后台 删除任意一篇文章
exports.deleteOneArt = async (ctx) => {

    // 首先是要判断用户是否登录了
    if(ctx.session.isNew){
        ctx.status = 404;
        return await ctx.render('404', {title: '404'})
    }

    // 定义返回值
    let msg = {
        'state': 0,
        'message': '用户没登录'
    }
    // 判断用户是否登录
    if(ctx.session.isNew) return msg;

    // 得到用户删除文章的id
    // const data = ctx.request.body; // 为甚么delete请求传递的数据获取不到
    const id = ctx.params.id;
    // 删除文章——>该用户的articleNum-1——>文章所有的评论删
    // 根据文章Id删除文章
    let article = new Article({id, ctx});
    const res = articleService.deleteById(article);
    if(res){
        msg.state = 1,
        msg.message = '删除文章成功'
    } else {
        msg.state = 0,
        msg.message = '删除文章失败'
    }
    // 返回数据给页面
    ctx.body = msg;
    
}

// 后台页面请求所有的文章列表
exports.getCurrArtList = async (ctx) => {
    // 首先是要判断用户是否登录了
    if(ctx.session.isNew){
        ctx.status = 404;
        return await ctx.render('404', {title: '404'})
    }

    // 得到后台返回的数据
    const res = await articleService.getCurrArtList(ctx.session.uid);
    // console.log(res);
    
    // 传递给admin-article.pug页面
    if(res){
        ctx.body = {
            code: 0,
            count: res.length,
            data: res
        };
    } else {
        ctx.body = {
            code: 0,
            count: 0,
            data: []
        };
    }

    
}

// 进入后台主页面
exports.index = async (ctx) => {
    // 首先是要判断用户是否登录了
    if(ctx.session.isNew){
        ctx.status = 404;
        return await ctx.render('404', {title: '404'})
    }

    // 登录了
    const flag = adminService.backStage(ctx);
    if(!flag){ // 请求路径没有
        return await ctx.render('404',{
            title: '404'
        }) 
    }
    // 得到用户请求的路径
    const id = ctx.params.id;
    // console.log(id);
    // console.log(ctx.session.role);

    // 请求路径有
    await ctx.render('./admin/admin-' + id, {
        role: ctx.session.role
    })
} 


