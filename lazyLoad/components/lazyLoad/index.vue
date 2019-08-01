<!--
 * @Description: 图片懒加载、预加载 v1.2
 * @Author: pocky
 * @Email 2460392754@qq.com
 * @Date: 2019-06-12 18:47:15
 * @LastEditTime: 2019-08-01 11:14:35
 * @instruction: https://www.yuque.com/pocky/aaeyux/neg4m1
 * @github: https://github.com/2460392754/uniapp-tools/tree/master/lazyLoad
 * @dcloud https://ext.dcloud.net.cn/plugin?id=495
 -->

<template>
    <view :class="['img-lazyLoad',uuid]">
        <!-- img -->
        <view :style="{opacity:isShowImg ? 1 :0}">
            <transition name="show">
                <image v-if="imgLoadStart"
                       :src="src"
                       :mode="mode"
                       @load="imgLoadSuccess"
                       @error="imgLoadError"
                       class='load-img'></image>
            </transition>

        </view>

        <!-- loading-img or loading-component -->
        <transition name="show">
            <view v-show="!isShowImg"
                  :id="uuid"
                  class='load-loading-container'>
                <image v-if="path.loading"
                       :src="path.loading"
                       class="load-loading-img slow"
                       mode="widthFix"></image>

                <view v-show="imgLoadStart"
                      class='load-loading-component'>
                    <loading-export :type="componentName.loading"></loading-export>
                </view>
            </view>
        </transition>

        <!-- error-img -->
        <transition name="show">
            <view class='load-error-container'>
                <image v-if="path.error"
                       :src="path.error"
                       class="load-error-img"
                       mode="widthFix"></image>

                <view class='load-error-component'>
                    <error-export :type="componentName.error"></error-export>
                </view>
            </view>
        </transition>
    </view>
</template>

<script>
import lazyLoadPlugins from "../../plugins/lazyLoad/js/lazyLoad";
import loadingExport from './animation/loadingExport';
import errorExport from './animation/errorExport';

export default {
    data () {
        return {
            // 图片的id
            uuid: "",

            // 图片加载开始
            imgLoadStart: false,

            // 图片加载结束
            imgLoadEnd: false,

            // 是否显示图片
            isShowImg: false,

            // 其他图片路径
            path: {
                loading: null,
                error: null
            },

            // 计数次数
            count: {
                nextLoad: 0,
                loadingAnime: 0
            },

            // 组件名称
            componentName: {
                loading: null,
                error: null
            }
        }
    },
    props: {
        // 图片路径
        src: {
            type: String,
            default: ""
        },

        // 图片裁剪、缩放的模式
        mode: {
            type: String,
            default: ""
        }
    },
    methods: {
        // 初始化
        $_init () {
            this.uuid = this.$_createUUID();
            this.$_setImgType("loading");
            this.$_registerImg();
        },

        // 设置图片类型
        $_setImgType (type) {
            let config = lazyLoadPlugins.getConfig();

            if (config[type].type === 'img') {
                this.path[type] = config[type].path;
            } else if (config[type].type === 'component') {
                this.componentName[type] = config[type].name;
            }
        },

        // 创建 uuid
        $_createUUID () {
            let ranStr = Math.random()
                .toString(32)
                .substring(2);
            let timestamp = new Date().getTime();

            return "uuid-" + ranStr + timestamp;
        },

        // 注册图片对象 ,监听图片加载状态
        $_registerImg () {
            lazyLoadPlugins.addImg({
                that: this,
                uuid: this.uuid,
                fn: () => {
                    return new Promise((resolve, reject) => {
                        if (this.imgLoadStart === true) reject();

                        this.imgLoadStart = true;
                        this.count.loadingAnime++;

                        this.$_minLoadAnime()
                        this.$watch("imgLoadEnd", resolve);
                    });
                }
            });
        },

        // 图片加载完成
        imgLoadSuccess () {
            this.imgLoadCommon();
        },

        // 图片加载出错
        imgLoadError () {
            this.imgLoadCommon();
            this.$_setImgType("error");
        },

        imgLoadCommon () {
            this.count.nextLoad++;
            this.count.loadingAnime++;
            this.$_minLoadAnime()
        },

        // 最少过度动画时间
        $_minLoadAnime () {
            if (this.count.loadingAnime !== 2) return;

            let { minLoadAnimeTime: time } = lazyLoadPlugins.getConfig()

            setTimeout(() => {
                this.isShowImg = true;
                this.count.nextLoad++;
            }, time);
        },

        // 图片加载间隔(停顿)时间
        $_intervalLoad () {
            let { intervalTime: time } = lazyLoadPlugins.getConfig()

            setTimeout(() => {
                this.imgLoadEnd = true;
            }, time);
        },
    },

    watch: {
        'count.nextLoad' (val) {
            val === 2 && this.$_intervalLoad();
        }
    },

    components: {
        loadingExport,
        errorExport
    },

    created () {
        this.$_init();
    }
}
</script>

<style scoped>
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
    width: fit-content;
    /* overflow: hidden; */
}

.img-lazyLoad .load-loading-container,
.img-lazyLoad .load-error-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.img-lazyLoad .load-img {
    height: max-content;
}

.img-lazyLoad .load-loading-img,
.img-lazyLoad .load-error-img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 60%;
    /* margin: auto; */
    margin: 0 auto;
    /* z-index: -1; */
}

.img-lazyLoad .load-loading-img.fast {
    animation: anime-fast 1.2s linear infinite;
}

.img-lazyLoad .load-loading-img.slow {
    animation: anime-fast 2s linear infinite;
}

.img-lazyLoad .load-loading-component,
.img-lazyLoad .load-error-component {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

@keyframes anime-fast {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>