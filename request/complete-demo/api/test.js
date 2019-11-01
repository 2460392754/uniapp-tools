import Request from '../plugins/request/js/index';

export default {
    // get 请求, 200 响应码
    getMockDataMethodGet200() {
        let r = Request();

        let reqId = r.interceptors.scoped.request.use(
            (config) => {
                console.log('is scoped request');

                return config;
            },
            (err) => {
                console.error('scoped request: ', err);

                return false;
            }
        );

        let repId = r.interceptors.scoped.response.use(
            (res, config) => {
                console.log('is scoped response');

                return res;
            },
            (err) => {
                console.error('scoped response: ', err);

                return Promise.reject(err);
            }
        );

        // 卸载 私有 请求 拦截器
        // instance.interceptors.scoped.request.eject(reqId)

        let instance = r.request({
            url: '/test/get/200',
            method: 'get',
            header: {
                // sid: 'xx',
                // ContentType: "application/json"
            },
            params: {
                name: 'xxx',
                age: 20
            },
        });

        // 超时 3000ms 就中断请求
        setTimeout(() => {
            r.abort(instance);
        }, 6000);

        return instance;
    },

    // get 请求, 400 响应码
    getMockDataMethodGet400() {
        return global.$http.request({
            url: '/test/get/400',
            method: 'get',
            header: { uid: 'xx' },
            params: {
                name: 'xxx',
                age: 20
            }
        });

        // return Request().request({
        //     url: '/test/get/400',
        //     method: 'get',
        //     params: {
        //         name: 'xxx',
        //         age: 20
        //     },
        // });
    },

    // post 请求， 200 响应码
    getMockDataMethodPost200() {
        return Request().post('/test/post/200', {
            header: {
                contentType: 'application/json'
            },
            data: {
                name: 'xx',
                age: 20,
                arr: [1, 2, 3, [11, 22]],
                obj: {
                    null: null
                },
                null: null
            }
        });
    },

    // download, 200 状态码
    getMockDataMethodDownload() {
        const r = Request();

        return r
            .get('/test/download')
            .then((res) => {
                console.log('is then', res);
                return res.data.img;
            })
            .then((path) =>
                r.download(path, {
                    params: {
                        a: 'is a'
                    },
                    onProgressUpdate(res) {
                        console.log(res);
                    }
                })
            );
    },

    // upload, 200 状态码
    getMockDataMethodUpload(path) {
        let r = Request();

        let instance = r.upload('/test/upload', {
            name: 'file',
            filePath: path,
            header: {},
            formData: {
                text: 'is upload file'
            },
            onProgressUpdate(res) {
                console.log(res);
            }
        });

        // 5s 之后还没上传完成就中断上传，会进入 catch 回调中
        setTimeout(() => {
            r.abort(instance);
        }, 5000);

        return instance;
    }
};
