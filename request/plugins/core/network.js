import Tools from '../tools';

// 普通请求
export const xhr = function (config) {
    let promise, instance;

    promise = new Promise((resolve, reject) => {
        instance = uni.request({
            ...config,
            success: resolve,
            fail: reject
        })
    });

    promise.__proto__.example = instance;

    return promise;
}

// 上传
export const upload = function (config) {
    const taskList = ['onProgressUpdate', 'onHeadersReceived', 'offProgressUpdate', 'offHeadersReceived'];
    let promise, instance;

    promise = new Promise((resolve, reject) => {
        instance = uni.uploadFile({
            ...config,
            success: res => {
                res.data = Tools.toJSON(res.data);

                resolve(res);
            },
            fail: reject,
        });

        taskList.forEach(task => {
            let fn = config[task];

            typeof fn === 'function' && instance[task](fn)
        });
    });

    promise.__proto__.example = instance;

    return promise;
}

// 下载
export const download = function (config) {
    const taskList = ['onProgressUpdate', 'onHeadersReceived', 'offProgressUpdate', 'offHeadersReceived'];
    let promise, instance;

    promise = new Promise((resolve, reject) => {
        instance = uni.downloadFile({
            ...config,
            success: resolve,
            fail: reject,
        });

        taskList.forEach(task => {
            let fn = config[task];

            typeof fn === 'function' && instance[task](fn)
        });
    });

    promise.__proto__.example = instance;

    return promise;
}