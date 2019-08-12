<template>
    <view class='index-page'>
        <scroll-view id="scroll"
                     :scroll-y="true"
                     @scroll="scroll">
            <v-lazyload src="/static/logo.png"
                        mode="widthFix"></v-lazyload>
            <v-lazyload src="/static/logo.png"
                        mode="widthFix"></v-lazyload>
            <v-lazyload src="/static/logo.png"
                        mode="widthFix"></v-lazyload>
            <v-lazyload src="/static/logo.png"
                        mode="widthFix"></v-lazyload>
            <v-lazyload src="/static/logo.png"
                        mode="widthFix"></v-lazyload>
            <v-lazyload src="/static/logo.png"
                        mode="widthFix"></v-lazyload>
        </scroll-view>
    </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VLazyload from "../../components/lazyLoad.vue";

@Component({
    components: {
        VLazyload
    }
})
export default class index extends Vue {
    scroll() {
        // VLazyLoad.scr
    }

    created() {
        console.log(this);
    }
}
</script>

<style>
#scroll {
    height: 600px; /* 需要给scroll-view设置高度 */
}

.index-page >>> .img-lazyLoad image {
    width: 200px;
}
</style>
