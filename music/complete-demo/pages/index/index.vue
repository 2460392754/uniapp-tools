<template>
    <view>
        <image src="/static/music.png"
               mode="widthFix"
               class='music'></image>
        <text class="name">演奏 - 天空之城</text>

        <button v-if="musicStatus === 'play' || musicStatus === null"
                @click="play">
            <view class='start'></view>
        </button>

        <button v-else-if="musicStatus === 'stop'"
                @click="stop">
            <view class='stop'></view>
        </button>
    </view>
</template>

<script>
import Music from '@/plugins/music/index'

export default {
    data () {
        return {
            musicStatus: null
        }
    },

    methods: {
        play () {
            this.musicStatus || Music.start();
            this.musicStatus = 'stop'
            Music.play();
        },

        stop () {
            this.musicStatus = 'play'
            Music.stop();
        }
    },

    created () {
        // Music.start();
    }
}
</script>

<style>
.music {
    width: 13%;
    margin: auto;
    display: block;
    padding: 80upx 0 40upx;
}

.name {
    text-align: center;
    width: 100%;
    display: inline-block;
    font-size: 28upx;
}

button {
    width: 50px;
    height: 50px;
    background: #f05542;
    border-radius: 100%;
    box-shadow: 2px 1px 3px #666;
    margin: 80upx auto;
}

button .start {
    position: absolute;
    background: #fff;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    box-shadow: 2px 2px #666;
}

button .stop {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    margin-top: 2px;
}

button .stop::before,
button .stop::after {
    content: "";
    display: inline-block;
    width: 8px;
    height: 20px;
    background: #fff;
    box-shadow: 2px 2px #666;
    margin: 0 2px;
}
</style>