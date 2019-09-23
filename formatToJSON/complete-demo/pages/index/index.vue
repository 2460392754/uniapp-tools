<template>
    <view class='index'>
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
                { title: 'object', path: '/pages/type/object' },
                { title: 'array', path: '/pages/type/array' },
                { title: 'other', path: '/pages/type/other' },
            ]
        }
    },
}
</script>

<style>
.index .btn {
    background: #2d8cf0;
    margin: 40upx;
    border: 4px solid #2d7acc;
}
</style>
