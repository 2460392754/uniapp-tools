<template>
    <view class="component-img-lazyload">
        <!-- img -->
        <anime-state-switch ref="img"
                            :is-opacity="isShowImg"
                            :time="animeSwitchTime"
                            class="img-container">
            <image v-if="imgLoadState.start"
                   class='img'
                   :src="src"
                   :mode="mode"
                   @load="imgLoadSuccess"
                   @error="imgLoadError"></image>
        </anime-state-switch>

        <!-- loading-img or loading-component -->
        <anime-state-switch ref="loading"
                            :is-if="hasLoadingRes"
                            :is-show="!isShowImg"
                            :id-name="guid"
                            :time="animeSwitchTime"
                            class='loading-container'>
            <image v-if="path.loading"
                   :src="path.loading"
                   class="loading-img"
                   mode="widthFix"></image>

            <view v-show="imgLoadState.start"
                  class='component-loading'>
                <loading-export :type="componentName.loading"></loading-export>
            </view>
        </anime-state-switch>

        <!-- error-img or error-component  -->
        <anime-state-switch ref="error"
                            :is-if="hasErrorRes"
                            :time="animeSwitchTime"
                            class='error-container'>
            <image v-if="path.error"
                   :src="path.error"
                   class="error-img"
                   mode="widthFix"></image>

            <view class='component-error'>
                <error-export :type="componentName.error"></error-export>
            </view>
        </anime-state-switch>
    </view>
</template>

<script>
import AnimeStateSwitch from './AnimeStateSwitch';
import loadingExport from './loadingExport';
import errorExport from './errorExport';
import lazyLoadPlugin from '../../plugins/lazyLoad/js/index';
import Tools from '../../plugins/lazyLoad/js/tools'

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
            default: "scaleToFill"
        },

        // 当前组件所在的scroll标签内的id
        scrollId: {
            type: String
        }
    },

    data () {
        return {
            // 图片 id
            guid: "",

            // 动画过度时间
            animeSwitchTime: 500,

            // 是否显示图片
            isShowImg: false,

            // 图片加载状态
            imgLoadState: {
                start: false,
                end: false
            },

            // 加载动画的图片名称
            path: {
                loading: null,
                error: null
            },

            // 加载动画的组件名称
            componentName: {
                loading: null,
                error: null
            },

            // 统计次数
            count: {
                nextLoad: 0,
                loadingAnime: 0
            },
        }
    },

    computed: {
        // 是否有 loading 资源
        hasLoadingRes () {
            return Boolean(this.path.loading || this.componentName.loading)
        },

        // 是否有 error 资源
        hasErrorRes () {
            return Boolean(this.path.error || this.componentName.error)
        }
    },

    methods: {
        // 初始化
        $_init () {
            this.guid = Tools.getGUID();
            this.animeSwitchTime = lazyLoadPlugin.getConfig().animeSwitchTime;
            this.$_setImgType("loading");
            this.$_on();
        },

        // 订阅并监听图片加载状态
        $_on () {
            lazyLoadPlugin.on({
                id: this.scrollId,
                guid: '#' + this.guid,
                context: this.$refs.loading,
                fn: () => {
                    return new Promise((resolve, reject) => {
                        this.imgLoadState.start = true;
                        this.count.loadingAnime++;
                        this.$_minLoadAnime()
                        this.$watch("imgLoadState.end", resolve);
                    })
                }
            })
        },

        // 设置图片
        $_setImgType (type) {
            const config = lazyLoadPlugin.getConfig();

            if (config[type].type === 'img') {
                this.path[type] = config[type].path;
            } else if (config[type].type === 'component') {
                this.componentName[type] = config[type].name;
            }
        },

        // 图片加载完成
        imgLoadSuccess () {
            this.$_imgLoadCommon();
        },

        // 图片加载出错
        imgLoadError () {
            this.$_imgLoadCommon();
            this.$_setImgType("error")
        },

        // 图片加载相同部分
        $_imgLoadCommon () {
            this.count.nextLoad++;
            this.count.loadingAnime++;
            this.$_minLoadAnime()
        },

        // 最少过度动画时间
        $_minLoadAnime () {
            if (this.count.loadingAnime != 2) return;

            let { minLoadAnimeTime: time } = lazyLoadPlugin.getConfig()

            setTimeout(() => {
                this.isShowImg = true;
                this.count.nextLoad++;
            }, time);
        },

        // 图片加载间隔(停顿)时间
        $_intervalLoad () {
            let { intervalTime: time } = lazyLoadPlugin.getConfig()

            setTimeout(() => {
                this.imgLoadState.end = true;
            }, time);
        }
    },

    watch: {
        'count.nextLoad' (val) {
            val === 2 && this.$_intervalLoad();
        }
    },

    created () {
        this.$_init();
    },

    components: {
        AnimeStateSwitch,
        loadingExport,
        errorExport
    }
}
</script>

<style lang="scss">
.component-img-lazyload {
    position: relative;

    .img {
        // width: auto;
        height: auto;
    }

    .component-loading,
    .component-error,
    .loading-img,
    .error-img {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
    }

    .component-loading,
    .component-error {
        width: max-content;
        height: max-content;
    }

    .loading-img,
    .error-img {
        width: 100upx;
    }

    .loading-img {
        animation: ball-scale-multiple 2s 0s linear infinite;
    }

    @keyframes ball-scale-multiple {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
}
</style>