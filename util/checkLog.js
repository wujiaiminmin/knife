/**
 * 这是control专门用来判断用户是否登录了，登录——>处理业务逻辑，没登录——>不受理
 */


module.exports = async function (ctx) {
    if(ctx.session.isNew){
        ctx.status = 404;
        return await ctx.render('404', {title: '404'})
    }
}