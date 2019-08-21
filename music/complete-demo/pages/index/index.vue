<template>
    <view>
        <text>演奏 - 天空之城</text>
        <button type="primary"
                @click="play">play</button>
        <button type="primary"
                @click="stop">stop</button>
    </view>
</template>

<script>
import Music from '@/plugins/music/index'

export default {
    data () {
        return {}
    },

    methods: {
        play () {
            Music.play();
        },

        stop () {
            Music.stop();
        }
    },

    created () {
        Music.start();
    }
}
</script>

<style>
</style>
