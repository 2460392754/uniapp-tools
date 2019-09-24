<script>
export default {
    onLaunch: function () {
        global.$route = this.$route;
    },
    onShow: function () {
    },
    onHide: function () {
    },

    watch: {
        $route (o) {
            global.$route = o;
        }
    }
}
</script>

<style>
/*每个页面公共css */
</style>
