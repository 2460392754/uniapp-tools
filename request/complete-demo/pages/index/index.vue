<template>
    <view id="index-page">
        <navigator v-for="(item,index) of list"
                   :key="index"
                   :url="item.path">
            <button class='btn'
                    type="primary">{{item.title}}</button>
        </navigator>
    </view>
</template>

<script>
export default {
    data () {
        return {
            list: [
                { title: 'get 200', path: '/pages/method/get_200' },
                { title: 'get 400', path: '/pages/method/get_400' },
                { title: 'post 200', path: '/pages/method/post_200' },
                { title: 'download', path: '/pages/method/download' },
                { title: 'upload', path: '/pages/method/upload' },
                { title: 'check token', path: '/pages/method/check_token' },
            ]
        }
    },
}
</script>

<style lang="scss">
#index-page {
    .btn {
        background: #2d8cf0;
        margin: 40upx;
        border: 4px solid #2d7acc;
    }
}
</style>
