import MyRequest from './core/index';
import Tools from './tools';
import { config } from './config';

function createInstance (defaultConfig) {
    const ctx = new MyRequest(defaultConfig);
    let instance;

    instance = MyRequest.prototype.request.bind(ctx);
    instance = Tools.extend(instance, MyRequest.prototype, ctx);
    instance = Tools.extend(instance, ctx);

    return instance;
}

function create () {
    return createInstance(config);
}

export default create;