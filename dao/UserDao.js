const UserModel = require('../model/UserModel');



// 修改用户的头像路径
exports.updateAvatar = async (user) => {
    const res = await UserModel.updateOne({'_id' : user.id}, {$set : {'avatar' : user.avatarUrl}});
    // console.log('修改用户头像路径的返回值是：' + res);
    return res;
}


// 后台 根据用户的Id删除用户
exports.delByUserId = async (userId) => {
    const res = await UserModel.deleteOne({'_id' : userId});
    // console.log('删除用户之后的返回值是：' + res);
    return res;
}

// 获取所有的用户列表
exports.getAllUser = async () => {
    // 注意，在查询数据库数据的时候，如果需要让返回的结果是对象数组，
    // 那么必须要使用Promise在then中返回值
    let userList = null;
    await new Promise((resolve, reject) => {

        userList = UserModel.find((err, data) => {
            err && reject(err);
            data && resolve(data);
        });

    })
    .then(data => {
        userList = data; // 在这一步以对象数组的形式赋值,出去的时候。
        // console.log('data的数据是：' + data);
        // console.log('userList的数据是：' + userList);
    })
    .catch(err => {
        console.log(err);
    })

    // console.log(userList);
    
    return userList;
}

// 更新用户发表文章的计数器
exports.addArticleNum = async (id, num) => {
    UserModel.updateOne({'_id': id}, {$inc: {'articleNum': num}}, (err, data) => {
        if(err) return console.log(err);
        // console.log('用户发表文章计数器更新成功！');
        data && console.log('更改用户的文章计数器返回结果是：' + data);
    })
}

// 更新评论的计数器
exports.addCommentNum =async (id, num) => {
    if(id){
        UserModel.updateOne({'_id': id}, {$inc: {'commentNum': num}}, err => {
            if(err) return console.log(err);
            // console.log('用户的评论计数器更新成功！');
        })
    }
}

// 根据name查找文档对象
exports.findByName = async (username) => {
    let user = null;
    await new Promise((resolve, reject) => {
        UserModel.find({username}, (err, data) => {
            err && reject(err);
            data && resolve(data);
        })
    })
    .then((data) => {
        if(data.length !== 0){
            // 注意： 查询对象是以数组对象的形式返回的。没有就是空数组。
            // console.log(data);
            user = data[0];
        }
    })
    .catch((err) => {
        console.log(err);
    })

    return user;
}

// save 方法
exports.save = async (instance) => {
    let res = null;
    await new Promise((resolve, reject) => {
        instance.save((err, data) => {
            err && reject(err);
            data && resolve(data);
        })
    })
    .then((data) => {
        data && (res = data);
    })
    .catch((err) => {
        err && console.log(err);
    })
    return res;
}
