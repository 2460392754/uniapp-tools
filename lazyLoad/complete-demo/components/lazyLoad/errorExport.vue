<template>
    <view>
        <error1 v-if="type === 'error-1'"></error1>
    </view>
</template>

<script>
import error1 from './anime/error-1.vue';

export default {
    // 组件名称
    props: {
        type: String
    },

    components: {
        error1
    }
}
</script>