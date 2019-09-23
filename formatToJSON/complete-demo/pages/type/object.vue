<template>
    <view class='object'>
        <print-json :value="data"></print-json>
    </view>
</template>

<script>
import PrintJson from '../../components/formatToJSON/printJSON';

export default {
    data () {
        return {
            data: JSON.parse('{"data":{"code":"200","data":{"message":"请求成功","data":false},"desc":"success"},"statusCode":200,"header":{"content-type":"application/json; charset=utf-8","content-length":"78"},"errMsg":"request:ok"}')
        }
    },

    components: {
        PrintJson
    }
}
</script>

<style>
</style>
