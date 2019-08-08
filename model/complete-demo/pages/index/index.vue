<template>
    <view class="content">
        <view class='id'>id: {{res.id}}</view>
        <view class='name'>name: {{res.name}}</view>
        <view class='age'>age: {{res.age}}</view>
        <view class='birthday'>birthday: {{res.birthday}}</view>
        <view class='email'>email: {{res.email}}</view>
    </view>
</template>

<script>
import request from '../../xhr/index.xhr.js'

export default {
    data () {
        return {
            res: {},
        }
    },

    methods: {
        async get () {
            this.res = await request.getMockData()
        }
    },

    created () {
        this.get();
    }
}
</script>

<style>
</style>
