/**
 * User domain 对象
 */

class Article {
    // 对象的构造器
    // 在ES6的对象中只能定义方法，属性需要定义在constructor函数中
    /**
     * 
     * @param {对象} opt 
     */
    constructor(opt){
        Object.keys(opt).forEach(key => {
            this[key] = opt[key];
        });
    }
}

module.exports = Article;