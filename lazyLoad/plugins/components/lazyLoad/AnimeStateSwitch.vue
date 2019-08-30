<template>
    <view v-if="cIf"
          v-show="cShow"
          class='stateSwitch'
          :id="idName"
          :style="{opacity: Number(cOpacity)}">
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

        isShow: {
            type: Boolean,
            default: true
        },

        isOpacity: {
            type: [Boolean, Number],
            default: true
        },

        idName: {
            type: String,
            default: null
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
            }, 500)
        },

        isOpacity (flag) {
            setTimeout(() => {
                this.cOpacity = flag
            }, 500)
        }
    }
}
</script>

<style scoped>
.stateSwitch {
    transition: opacity 0.5s;
}
</style>