<template>
    <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import request from "../../ts/request/index";

@Component
export default class index extends Vue {
    private $_callback() {
        let r = request.get({
            url:
                "https://easy-mock.com/mock/5cda87e31d38be0d2dd91a44/example/get",
            // url: "/5cda87e31d38be0d2dd91a44/example/get",
            // url: "/5cda87e31d38be0d2dd91a44/example/get_400",
            data: {
                a: "aaaa"
            },
            contentType: "form",
            success: res => {
                console.log("success", res);
            },
            fail: err => {
                console.log("fail", err);
            },
            complete: res => {
                console.log("complete: ", res);
            }
        });

        // request.stop(r);
    }

    private $_promise() {
        let r = request
            .post({
                url: "/5cda87e31d38be0d2dd91a44/example/post"
            })
            .then(res => {
                console.log("then: ", res);
            })
            .catch(err => {
                console.log("catch", err);
            })
            .finally(() => {
                console.log("is finally");
            });

        // request.stop(r);
    }

    created() {
        this.$_callback();
        // this.$_promise();
    }
}
</script>
<style></style>;
