<template>
    <view class='other'>
        <print-json :value="data"></print-json>
    </view>
</template>

<script>
import PrintJson from '../../components/formatToJSON/printJSON';

export default {
    data () {
        return {
            data: {
                isNumber: 123,
                isString: 'xxx',
                isBoolean: false,
                isNull: null,
                isUndefined: undefined,
                isArray: ['a', 'b', ['c']],
                isObject: {
                    a: 'is a',
                    b: 'is b',
                    c: {
                        c1: 'is c1'
                    }
                }
            }
        }
    },

    components: {
        PrintJson
    }
}
</script>