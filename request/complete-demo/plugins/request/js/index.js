/*
 * @Description: uniapp request请求库 v2.0.4
 * @Author: pocky
 * @Email 2460392754@qq.com
 * @Date: 2019-05-31 19:18:48
 * @LastEditTime: 2019-11-01 14:32:42
 * @instruction: https://www.yuque.com/pocky/aaeyux/pdik23
 * @github: https://github.com/2460392754/uniapp-tools/tree/master/request
 * @dcloud: https://ext.dcloud.net.cn/plugin?id=468
 */

import MyRequest from './core/index';
import Tools from './tools';

function createInstance() {
    const ctx = new MyRequest();
    let instance;

    instance = MyRequest.prototype.request.bind(ctx);
    instance = Tools.extend(instance, MyRequest.prototype, ctx);
    instance = Tools.extend(instance, ctx);

    return instance;
}

function create() {
    return createInstance();
}

export default create;
