<template>
    <view>
        <loading1 v-if="type === 'loading-1'"></loading1>
        <loading2 v-if="type === 'loading-2'"></loading2>
    </view>
</template>

<script>
import loading1 from './anime/loading-1.vue';
import loading2 from './anime/loading-2.vue';

export default {
    // 组件名称
    props: {
        type: String
    },

    components: {
        loading1,
        loading2,
    }
}
</script>
