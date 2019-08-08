import Model from '../model/index.model'

function request (config) {
    return new Promise((resolve, reject) => {
        uni.request({
            ...config,
            success: resolve,
            fail: reject
        })
    })
}

export default {
    async getMockData () {
        const res = await request({ url: '/api/index/mock' })

        return Model.parse(res.data);
    }
}