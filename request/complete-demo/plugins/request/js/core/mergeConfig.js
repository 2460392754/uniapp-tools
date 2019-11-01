import Tools from '../tools';

function mergeConfig(defaultConfig, instanceConfig = {}) {
    const CONFIG_KEY_LIST = ['url', 'method', 'data', 'dataType', 'responseType', 'params'];
    const CONFIG_MERGE_DEEP_KEY_LIST = ['header'];
    const CONFIG_OPTIONAL_KEY_LIST = ['baseURL'];
    const CONFIG_ALL_KEY_LIST = [
        ...CONFIG_KEY_LIST,
        ...CONFIG_MERGE_DEEP_KEY_LIST,
        ...CONFIG_OPTIONAL_KEY_LIST
    ];
    const ARGS_ALL_KEY_LIST = [
        ...new Set([...Object.keys(instanceConfig), ...Object.keys(defaultConfig)])
    ];
    const REMAINDER_KEY_LIST = ARGS_ALL_KEY_LIST.filter(
        (key) => !CONFIG_ALL_KEY_LIST.includes(key)
    );
    let newConfig = {};

    // 必要参数
    CONFIG_KEY_LIST.forEach((prop) => {
        const val = instanceConfig[prop] || defaultConfig[prop];

        !Tools.isType('Undefined', val) && (newConfig[prop] = val);
    });

    // 必要深拷贝参数
    CONFIG_MERGE_DEEP_KEY_LIST.forEach((prop) => {
        const defaultVal = defaultConfig[prop];
        const instanceVal = instanceConfig[prop];

        if (Tools.isType('Object', instanceVal)) {
            newConfig[prop] = Tools.deepCopy(defaultVal, instanceVal);
        } else if (Tools.isType('Object', defaultVal)) {
            newConfig[prop] = Tools.deepCopy(defaultVal);
        }
    });

    // 配置文件中可选参数
    CONFIG_OPTIONAL_KEY_LIST.forEach((prop) => {
        const val = defaultConfig[prop];

        if (!Tools.isType('Undefined', val)) {
            newConfig[prop] = defaultConfig[prop];
        }
    });

    // 合并未出现在上述列表中的参数
    REMAINDER_KEY_LIST.forEach((prop) => {
        const defaultVal = defaultConfig[prop];
        const instanceVal = instanceConfig[prop];

        if (!Tools.isType('Undefined', instanceVal)) {
            newConfig[prop] = instanceVal;
        } else if (!Tools.isType('Undefined', defaultVal)) {
            newConfig[prop] = defaultVal;
        }
    });

    newConfig.instanceURL = instanceConfig.url;
    newConfig.url = Tools.getFullURL(newConfig.baseURL, newConfig.url);
    newConfig.url = Tools.paramsToURL(newConfig);
    newConfig.header = Tools.adapterContentType(
        defaultConfig.header,
        instanceConfig.header,
        newConfig.header
    );

    // 删除 method为upload时，默认的content-type
    if (newConfig.method === 'upload') {
        delete newConfig.header['content-type'];
    }

    return newConfig;
}

export default mergeConfig;
