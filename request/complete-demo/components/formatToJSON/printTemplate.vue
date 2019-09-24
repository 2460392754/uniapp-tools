<template>
    <view class="v-component-print-template">
        <view v-for="(childNode,index) of node"
              :key="index">
            <view :id="isQuoteType(childNode.value) && `computed-style-${layer}-${index}`"
                  class="inlineBlock">
                <text v-if="!isType('undefined',childNode.key)"
                      class="key">{{childNode.key}}</text>

                <text class="symbol">:</text>
            </view>

            <view :class="[isQuoteType(childNode.value) ? 'block' : 'inlineBlock']"
                  :style="{marginLeft: list.style[index]+'px'}">
                <view v-if="isQuoteType(childNode.value)"
                      class='is-object'>
                    <text class="btn"
                          @click="changeBtnStatus(index)">{{list.isShow[index] ? '+' : '-'}}</text>
                    <view v-show="!list.isShow[index]">
                        <v-print-template :node="isType('array',childNode.value) ? childNode.value : [childNode.value]"
                                          :layer="layer + 1"></v-print-template>
                    </view>
                </view>

                <text v-else
                      class="value">{{childNode.value}}</text>
            </view>
        </view>
    </view>
</template>

<script>
import VPrintTemplate from './printTemplate';

export default {
    name: 'v-print-template',

    props: {
        node: {
            default: null,
        },

        layer: {
            type: Number,
            default: 0
        }
    },

    data () {
        return {
            list: {
                style: [],
                isShow: []
            }
        }
    },

    computed: {
        // 引用类型
        isQuoteType () {
            return val => {
                return this.isType('object', val) || this.isType('array', val);
            }
        },

        // 类型判断
        isType () {
            return (type, anyVal) => {
                let newType = type.substring(0, 1).toUpperCase() + type.substring(1);

                return Object.prototype.toString.call(anyVal) === `[object ${newType}]`;
            }
        }
    },

    methods: {
        // 获取 容器中样式的宽度
        $_getContainerStyleWidth (id) {
            return new Promise(resolve => {
                const view = uni.createSelectorQuery().in(this);

                view.select(id)
                    .fields({
                        size: true,
                    }, data => {
                        resolve(data);
                    }).exec();
            });
        },

        // 添加 列表
        $_addList (val) {
            this.list.style.push(val);
        },

        // 遍历数据
        async $_forEach () {
            for (let i = 0; i < this.node.length; i++) {
                const id = `#computed-style-${this.layer}-${i}`;
                const ret = await this.$_getContainerStyleWidth(id) || {};
                this.$_addList(ret.width || 0);
            }
        },

        // 监听 btn 状态
        changeBtnStatus (index) {
            let val = !this.list.isShow[index];

            this.$set(this.list.isShow, index, val)
        }
    },

    mounted () {
        this.$_forEach();
    },

    components: {
        VPrintTemplate,
    },

    watch: {
        node () {
            this.$nextTick(this.$_forEach)
        }
    }
}
</script>

<style lang="scss">
.v-component-print-template {
    width: max-content;
    // padding: 20upx;

    .key {
        color: #5cadff;
    }

    .symbol {
        color: #ff9900;
        margin: 0 10upx 0 5upx;
    }

    .value {
        color: #ed4014;
    }

    .btn {
        position: absolute;
        transform: translateY(-100%);
        width: 40upx;
        height: 40upx;
        display: block;
        text-align: center;
        line-height: 40upx;
        background: #d4d4d4;
        border-radius: 100%;
        color: #5f5e5e;
        box-shadow: 0px 0px 5px 0px #545252;
        font-weight: bold;
    }

    .block {
        display: block;
    }

    .inlineBlock {
        display: inline-block;
    }

    .is-object {
        position: relative;
    }
}
</style>