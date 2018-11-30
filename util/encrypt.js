const crypto = require('crypto');

/**
 * @param password 要加密的数据
 * @param key 加密签名
 */

module.exports = (password, key = 'wuji ai min min') => {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(password);
    // 加密后的数据只能被输出一次
    const passwordHmac = hmac.digest('hex');
    return passwordHmac;

}
