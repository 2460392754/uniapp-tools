<template>
    <view v-if="cIf"
          v-show="cShow"
          class='component-state-switch'
          :id="idName"
          :style="{
              opacity: Number(cOpacity),
              transition: `opacity ${time / 1000}s ease-in-out`
           }">
        <slot></slot>
    </view>
</template>

<script>
export default {
    props: {
        isIf: {
            type: Boolean,
            default: true
        },

        // 
        isShow: {
            type: Boolean,
            default: true
        },

        // 是否透明
        isOpacity: {
            type: [Boolean, Number],
            default: true
        },

        // 设置id样式
        idName: {
            type: String,
            default: null
        },

        // 动画过度时间
        time: {
            type: Number,
        }
    },

    data () {
        return {
            cIf: this.isIf,
            cShow: this.isShow,
            cOpacity: this.isOpacity
        }
    },

    watch: {
        isIf (flag) {
            this.cIf = flag
        },

        isShow (flag) {
            this.cOpacity = flag;

            setTimeout(() => {
                this.cShow = this.isShow;
            }, this.time)
        },

        isOpacity (flag) {
            setTimeout(() => {
                this.cOpacity = flag
            }, this.time)
        }
    }
}
</script>