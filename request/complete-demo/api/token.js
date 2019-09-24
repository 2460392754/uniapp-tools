import Request from '../plugins/request/js/index';

export default {
    // 获取 模拟token
    getMockToken (id) {
        return Request().get('/test/token/get?id=' + id);
    },

    // 验证 模拟token，id为 2460392754 则 success，code 200， 否则 fail code 为 401
    checkMockToken (token) {
        return Request().request({
            url: '/test/token/check',
            method: 'get',
            header: { token }
        })
    }
}