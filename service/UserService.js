/**
 * UserService 服务层
 */
// 导入模型层
const UserModel = require('../model/UserModel');
// 导入 UserDao
const UserDao = require('../dao/UserDao');
// 带入User domain类
const User = require('../domain/User');
// 导入加密工具 encrypt.js
const encrypt = require('../util/encrypt');
// 导入 articleService
const articleService = require('../service/ArticleService'); 
// 导入 Article doamin对象
const Article = require('../domain/Article');


// 修改用户头像路径
exports.updateAvatar = async (user) => {
    const res = await UserDao.updateAvatar(user); // 可以考虑抽出一个公共的修改用户数据的API
    return res;
}

// 后台 删除用户
exports.delByUserId = async (userId) => {

    // 删除用户的所有文章(首先查出找出该用户所有的文章，)
    const artList = await articleService.getCurrArtList(userId);
    // console.log(artList);
    
    // 循环删除每一篇文章
    artList.forEach((art) => {
        articleService.deleteById(new Article({id: art._id}));
    });

    const res = await UserDao.delByUserId(userId); // 人还是最后删除，因为有可能评论是他自己发的
    // if(!res) return null;

    return res;
}

// 后台 获取所有用户
exports.getAllUser = async () => {
    const useList = await UserDao.getAllUser();
    return useList;
}

// 更新用户发表文章的计数器
exports.addArticleNum = async (id, num) => {
    UserDao.addArticleNum(id, num);
}

// 更新用户的评论计数器
exports.addCommentNum = async (id, num) => {
    UserDao.addCommentNum(id, num);
}

// 确定用户的状态，保持用户的状态
exports.keepLog = async (ctx) => {
    // 如果session不存在
    if(ctx.session.isNew){ // session状态时新的时候
        // let username = ctx.cookies.get('username');
        // 如果cookies存在
        if(ctx.cookies.get('username')){
            // 调用UserDao查询对象
            const user = await UserDao.findByName(username);
            // 重新设置session
            ctx.session = {
                'username': user.username,
                'uid': user._id,
                'avatar': user.avatar,
                'role': user.roel
            }
        }
    }
}

// 用户登录请求业务
exports.login = async (data) => {
    let status = '恭喜你，登录成功！';

    const username = data.username;    
    const password = encrypt(data.password);

    // 调用dao的方法获取数据的对象
    const user = await UserDao.findByName(username);
    // console.log(user);
    
    // 如果对象没有查询到的话，
    if(!user){
        status = '用户名不正确！';
        return status;
    }
    // 如果查询到对象
    if(user.password !== password){
        status = '密码不正确！';
        return status;
    }

    // 有对象、密码正确，需要处理session和cookie
    // 获取control传递的上下文对象ctx
    const ctx = data.ctx;

    // 设置cookie对象，设置用户名和密码
    ctx.cookies.set('username', user.username, {
        domain: ctx.URL.hostname,
        path: '/',
        maxAge: 36e5,
        httpOnly: true, // 不让客户端访问这个cookie
        overwrite: true
    })
    ctx.cookies.set('uid', user._id, {
        domain: ctx.URL.hostname,
        path: '/',
        maxAge: 36e5,
        httpOnly: true, // 不让客户端访问这个cookie
        overwrite: true
    })
    // 设置session
    ctx.session = {
        'username': user.username,
        'uid': user._id,
        'avatar': user.avatar,
        'role': user.role
    }
    
    return status;

}

// service层处理用户注册的业务逻辑
exports.reg = async (data) => {
    // 定义返回信息对象
    let status = '';

    // console.log(data);
    const username = data.username;
    const password = encrypt(data.password);

    // 注意：在js中IO操作都是异步的，如果需要得到结果就必须要使用 async函数 + await调用方法
    const res = await UserDao.findByName(username);
    
    // 用户名被人注册，res默认是 false
    if(res){
        return status = '该用户名已存在，请重新注册。'
    }

    
    // 用户名没有被注册
    // 封装User的属性选项
    let opt = {
        username,
        password,
        commentNum: 0,
        articleNum: 0
    }
    // 构建User数据对象
    const user = new User(opt);
    // 利用UserModel模型来构建文档实例
    const userModel = new UserModel(user);
    // 调用DAO 保存文档实例
    const val = await UserDao.save(userModel);
    if(val){
        // 如果val存在
        status = '用户注册成功';
    }else{
        status = '用户注册失败'
    }
    
    return status;
}

