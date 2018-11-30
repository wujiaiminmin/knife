const Koa = require('koa');
const logger = require('koa-logger');
const static = require('koa-static');
const views = require('koa-views');
const { join } = require('path');
const body = require('koa-body');
const router = require('./routers/router');
const session = require('koa-session');


// 创建koa实例
const app = new Koa();

// session 签名
app.keys = ['john love beauty'];
// 配置session
const CONFIG = {
    maxAge: 36e5,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: false, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false,
}
// 安装koa-session中间件
app.use(session(CONFIG, app));

// 安装koa-logger中间件，日志组件需要第一个安装
app.use(logger());


// 配置 koa-body 处理 POST 方式提交的数据
app.use(body());


// 配置静态资源根目录,静态资源目录放置的时候js、css、img等等
app.use(static(join(__dirname, './public')));

// 配置模板视图根目录
app.use(views(join(__dirname, './views'), {
    extension: 'pug' // 配置模板文件的后缀，想前端渲染模板文件的时候就可以不带后缀了
}));







// 注册路由，只需要使用就可以了，所有的请求router已经设置好了
app
    .use(router.routes())
    .use(router.allowedMethods());



/* app.use((ctx) =>{
    // 如果该箭头函数不加（），第一次访问log函数默认执行2次。
    console.log('__dirname=>' + __dirname);
    ctx.body = 'hello';
});
 */
app.listen('3000', () => {
    console.log('服务启动成功，监听在3000端口');
});


// 创建管理员用户 如果管理员用户已经存在 则返回
{
    const { db } = require('./connectdb/config');
    const UserSchema = require('./schema/UserShema');
    const encrypt = require('./util/encrypt');
    const UserModel = require('./model/UserModel');

    UserModel
        .find({'username' : 'admin'}) // 查询admin用户是存在
        .then(data => {
            // 如果admin不存在就创建
            if(data.length === 0){
                new UserModel({
                    username: 'admin',
                    password: encrypt('admin'),
                    role: 666,
                    commentNum: 0,
                    articleNum: 0
                })
                .save() // 可以有一个回调函数
                .then(data => {
                    console.log(data);
                    console.log('管理员用户名 -> admin, 密码 -> admin');
                })
                .catch(err => {
                    console.log('管理员账号检查失败');
                })
            } else {
                console.log(`管理员用户名 -> admin, 密码 -> admin`);
            }
        })
        .catch(err => console.log(err))
}









