/**
 * 创建 UserSchema 集合约束
 * user 的schema约束，注意在mongoose的schema对象中有很多的钩子的函数，
 * 可以帮助我们更加快捷的操作数据库。但是前提是操作mongodb数据的API必须是集合实例的方法，
 * 属于集合类的静态方法操作数据库的话是不会触发钩子函数拦截的。
 */

 // 导入Schema对象
const { Schema } = require('../connectdb/config');
// 使用Schema对象创UserSchem
const UserSchema = new Schema({
    // 用户名
    username: String,
    // 密码
    password: String,
    //用户角色
    role: {
        type: String,
        default: 1
    },
    // 用户头像
    avatar: {
        type: String,
        default: '/avatar/default.jpg'
    },
    // 用户所发文章数
    articleNum: Number,
    // 用户所发评论数
    commentNum: Number
}, {versionKey: false});

// 钩子函数 pre post 都是在模型对象实例操作数据库之前拦截触发的。
// 注意： 写了钩子函数就一定要使用，否则报错
// UserSchema.pre('save', (ctx)=>{

// });
// UserSchema.post('remove', (ctx)=>{

// });


// 我们可以在UserSchema上添加方法，使用该schema模型实例出来的对象都可以访问
// UserSchema 查找用户
// UserSchema.methods.




// 导出UserSchema集合约束
module.exports = UserSchema;