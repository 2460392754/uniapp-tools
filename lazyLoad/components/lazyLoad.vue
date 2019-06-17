<template>
    <view class="img-lazyLoad">
        <image class="load-img"
               v-if="!loadSuccess"
               :src="newSrc"
               :mode="mode"
               :id="uuid"></image>

        <transition name="show">
            <image v-if="startLoad"
                   :src="src"
                   :mode="mode"
                   :style="{opacity:loadSuccess}"
                   @load="load"
                   @error="error"></image>
        </transition>
    </view>
</template>

<script>
export default {
    props: {
        src: {
            type: String,
            default: ""
        },
        mode: {
            type: String,
            default: ""
        }
    },

    data () {
        return {
            newSrc: "",
            uuid: "",
            startLoad: false,
            loadSuccess: false
        }
    },

    methods: {
        // 初始化
        $_init () {
            this.uuid = this.$_getUUID();
            this.$_setImgPath("loading");

            // 注册对象
            global.$lazyLoad.registerImg(this, this.uuid, () => {
                this.startLoad = true;

                return new Promise((resolve, reject) => {
                    this.$watch("loadSuccess", resolve)
                });
            });
        },

        // 设置图片路径
        $_setImgPath (type) {
            const config = global.$lazyLoad.getConfig();

            this.newSrc = config[type];
        },

        // 获取 uuid
        $_getUUID () {
            const ranStr = Math.random().toString(32).substring(2),
                timestamp = new Date().getTime();

            return "uuid-" + ranStr + timestamp;
        },

        load () {
            this.loadSuccess = true;
        },

        error (e) {
            this.$_setImgPath("error")
        }
    },

    created () {
        this.$_init();
    },
} 
</script>

<style>
.show-enter-active {
    transition: opacity 0.5s;
}
.show-leave-active {
    transition: opacity 0.5s;
}
.show-enter,
.show-leave-active {
    opacity: 0;
}

.img-lazyLoad {
    position: relative;
}

.img-lazyLoad .load-img {
    position: absolute;
}
</style>
