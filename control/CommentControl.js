const commentService = require('../service/CommentService');



// 保存评论
exports.saveComment = async (ctx) => {
    // 获取保存评论提交的数据
    let data = ctx.request.body;
    data.ctx = ctx; // 把ctx对象交给service层
    // console.log(data);
    const comment = await commentService.saveComment(data);
    // 定义返回值对象
    let res = {
        msg: '保存评论成功',
        status: 1
    }
    if(!comment){
        // 保存不成功
        res.msg = '保存评论失败',
        res.status = 0
    }
    // 给页面返回值
    ctx.body = res;

}

