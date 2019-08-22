<template>
    <view>
        <loading1 v-if="type === 'loading-1'"></loading1>
    </view>
</template>

<script>
import loading1 from './loading-1.vue';

export default {
    props: {
        type: String
    },

    components: {
        loading1
    }
}
</script>

<style>
</style>
