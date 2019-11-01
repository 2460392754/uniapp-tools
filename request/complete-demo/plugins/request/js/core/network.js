import Tools from '../tools';

// 普通请求
export const xhr = function(config) {
    let promise, instance;

    promise = new Promise((resolve, reject) => {
        instance = uni.request({
            ...config,
            success: resolve,
            fail: reject
        });
    });

    promise.__proto__.example = instance;

    return promise;
};

// 上传
export const upload = function(config) {
    let promise, instance;

    promise = new Promise((resolve, reject) => {
        instance = uni.uploadFile({
            ...config,
            success: (res) => {
                res.data = Tools.toJSON(res.data);

                resolve(res);
            },
            fail: reject
        });

        addTask(config, instance);
    });

    promise.__proto__.example = instance; // 使用 `Object.setProrotypeOf` 会修改自己的隐性原型，把 `Promise` 重新指向成 `Object`

    return promise;
};

// 下载
export const download = function(config) {
    let promise, instance;

    promise = new Promise((resolve, reject) => {
        instance = uni.downloadFile({
            ...config,
            success: resolve,
            fail: reject
        });

        addTask(config, instance);
    });

    promise.__proto__.example = instance;

    return promise;
};

function addTask(config, instance) {
    const taskList = [
        'onProgressUpdate',
        'onHeadersReceived',
        'offProgressUpdate',
        'offHeadersReceived'
    ];

    taskList.forEach((task) => {
        let callback = config[task];

        typeof callback === 'function' && instance[task](callback);
    });
}
