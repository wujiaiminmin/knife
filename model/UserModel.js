/**
 * 根据UserSchema集合约束创建UserModel集合模型供UserControl使用
 */

// 导入数据库连接对象
const { db } = require('../connectdb/config');
// 导入UserSchema集合约束
const UserSchema = require('../schema/UserShema');


// 创建UserModel集合模型类，同时在数据库创建users集合
// 这个UserModel类也是我们构建文档对象的类
const UserModel = db.model('users', UserSchema);


// 导出UserModel
module.exports = UserModel;