<template>
    <view class='array'>
        <print-json :value="data"></print-json>
    </view>
</template>

<script>
import PrintJson from '../../components/formatToJSON/printJSON';

export default {
    data () {
        return {
            data: [
                'a',
                'b',
                ['c1', 'c2'],
                { d: 'd1' }
            ]
        }
    },

    components: {
        PrintJson
    }
}
</script>
