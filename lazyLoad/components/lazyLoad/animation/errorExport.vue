<template>
    <view>
        <error1 v-if="type === 'error-1'"></error1>
    </view>
</template>

<script>
import error1 from './error-1.vue';

export default {
    props: {
        type: String
    },

    components: {
        error1
    }
}
</script>

<style>
</style>
