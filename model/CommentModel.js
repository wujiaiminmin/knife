const { db } = require('../connectdb/config');
const CommentSchema = require('../schema/CommentSchema');

const CommentModel = db.model('comments', CommentSchema);

module.exports = CommentModel;