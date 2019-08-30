<!--
 * @Description: 图片懒加载、预加载 v1.2.4
 * @Author: pocky
 * @Email 2460392754@qq.com
 * @Date: 2019-06-12 18:47:15
 * @LastEditTime: 2019-08-01 11:14:35
 * @instruction: https://www.yuque.com/pocky/aaeyux/neg4m1
 * @github: https://github.com/2460392754/uniapp-tools/tree/master/lazyLoad
 * @dcloud https://ext.dcloud.net.cn/plugin?id=495
 -->

<template>
    <view class="img-lazyLoad">
        <!-- img -->
        <anime-state-switch ref="img"
                            :isOpacity="isShowImg"
                            class='load-img-container'>
            <image v-if="imgLoadStart"
                   class='load-img'
                   :src="src"
                   :mode="mode"
                   @load="imgLoadSuccess"
                   @error="imgLoadError"></image>
        </anime-state-switch>

        <!-- loading-img or loading-component -->
        <anime-state-switch ref="loading"
                            :isIf="hasLoadingRes"
                            :isShow="!isShowImg"
                            :idName="uuid"
                            class='load-loading-container'>
            <image v-if="path.loading"
                   :src="path.loading"
                   class="load-loading-img"
                   mode="widthFix"></image>

            <view v-show="imgLoadStart"
                  class='load-loading-component'>
                <loading-export :type="componentName.loading"></loading-export>
            </view>
        </anime-state-switch>

        <!-- error-img or error-component  -->
        <anime-state-switch ref="error"
                            :isIf="hasErrorRes"
                            class='load-error-container'>
            <image v-if="path.error"
                   :src="path.error"
                   class="load-error-img"
                   mode="widthFix"></image>

            <view class='load-error-component'>
                <error-export :type="componentName.error"></error-export>
            </view>
        </anime-state-switch>
    </view>
</template>

<script>
import lazyLoadPlugins from "../../plugins/lazyLoad/js/lazyLoad";
import LoadingExport from './animation/loadingExport';
import ErrorExport from './animation/errorExport';
import AnimeStateSwitch from './AnimeStateSwitch';

export default {
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
        },

        // 当前组件所在的scroll标签内的id
        scrollid: {
            type: [String, null],
            default: null
        }
    },

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

    computed: {
        hasLoadingRes () {
            return Boolean(this.path.loading || this.componentName.loading)
        },

        hasErrorRes () {
            return Boolean(this.path.error || this.componentName.error)
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
            let ranStr = Math.random().toString(32).substring(2);
            let timestamp = new Date().getTime();

            return "uuid-" + ranStr + timestamp;
        },

        // 注册图片对象 ,监听图片加载状态
        $_registerImg () {
            lazyLoadPlugins.addImg({
                ctx: this.$refs.loading,
                uuid: this.uuid,
                callback: () => {
                    return new Promise((resolve, reject) => {
                        if (this.imgLoadStart === true) reject();

                        this.imgLoadStart = true;
                        this.count.loadingAnime++;

                        this.$_minLoadAnime()
                        this.$watch("imgLoadEnd", resolve);
                    });
                }
            }, this.scrollid);
        },

        // 图片加载完成
        imgLoadSuccess () {
            // console.log('success')
            this.imgLoadCommon();
        },

        // 图片加载出错
        imgLoadError () {
            // console.log('error')
            this.imgLoadCommon();
            this.$_setImgType("error")
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
        LoadingExport,
        ErrorExport,
        AnimeStateSwitch
    },

    created () {
        this.$_init();
    }
}
</script>

<style>
.img-lazyLoad {
    position: relative;
    width: fit-content;
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
    margin: 0 auto;
}

.img-lazyLoad .load-loading-component,
.img-lazyLoad .load-error-component {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>