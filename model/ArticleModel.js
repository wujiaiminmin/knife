const { db } = require('../connectdb/config');
const ArticleSchema = require('../schema/ArticleSchema');

const ArticlModel = db.model('articles', ArticleSchema);

module.exports = ArticlModel;