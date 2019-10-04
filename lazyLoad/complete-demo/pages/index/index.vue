<template>
    <view class="index-page">
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
                { title: '基本使用', path: '/pages/type/index' },
                { title: '原生事件', path: '/pages/type/native' },
                { title: '横屏加载', path: '/pages/type/vertical' },
                { title: 'tab切换', path: '/pages/type/tabs' },
                { title: '多加载', path: '/pages/type/many' },
            ]
        }
    }
}
</script>

<style>
.index-page .btn {
    background: #2d8cf0;
    margin: 40upx;
    border: 4px solid #2d7acc;
}
</style>