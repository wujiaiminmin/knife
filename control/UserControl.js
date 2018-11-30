/**
 * 控制层处理User相关的操作。
 */

// 导入 userService
const userService = require('../service/UserService');




// 用户退出 -> 清除cookie，清除session
exports.logout = (ctx) => {
    ctx.session = null;
    ctx.cookies.set('username', null, {
        maxAge: 0
    })
    ctx.cookies.set('uid', null, {
        maxAge: 0
    })
    // 在后台重定向到应用根路径
    ctx.redirect('/');
}


// 确定用户的状态，保持用户的状态
exports.judgeLog = async (ctx, next) => {
    !ctx.session.isNew && ctx.cookies.get('username') && await userService.keepLog(ctx);
    await next();
}


// 处理用户登录请求
exports.login = async (ctx) => {
    // 接收到用户登录的数据
    const data = ctx.request.body;
    // 把ctx对象嫁给data，方便service层使用
    data.ctx = ctx;
    // 调用服务层的login方法
    const status = await userService.login(data);

    // console.log(ctx.URL);
    
    
    await ctx.render('isOk',{
            status,
            path: ctx.URL.origin + (status=='恭喜你，登录成功！'?'/':'/user/login')
        }
    )
}


// 负责接收用户注册时候传递的数据
exports.reg = async (ctx) => {

    // control控制层获取用户注册提交的数据
    const data = ctx.request.body;
    // 调用service层的reg方法
    const status = await userService.reg(data); 

    await ctx.render('isOk', 
        {
            status,
            path: ctx.URL.origin + (status=='用户注册成功'?'/user/login':'/user/reg')
        }
    )
    
};
