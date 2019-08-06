<template>
    <div></div>
</template>

<script>
import request from '../../plugins/request/js/index'

export default {
    methods: {
        $_callback () {
            let r = request.get({
                // url: "https://easy-mock.com/mock/5cda87e31d38be0d2dd91a44/example/get",
                // url: "/5cda87e31d38be0d2dd91a44/example/get",
                url: "/5cda87e31d38be0d2dd91a44/example/get_400",
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
        },

        $_promise () {
            let r = request
                .get({
                    // url: "https://easy-mock.com/mock/5cda87e31d38be0d2dd91a44/example/get",
                    url: "/5cda87e31d38be0d2dd91a44/example/get_400",
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
    },

    created () {
        this.$_callback();
        // this.$_promise();
    }
}
</script>