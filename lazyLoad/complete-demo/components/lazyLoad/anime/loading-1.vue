<template>
    <!-- https://connoratherton.com/loaders -->
    <view class='loading-1'>
        <view></view>
        <view></view>
        <view></view>
    </view>
</template>

<script>
export default {}
</script>

<style>
@keyframes ball-scale-multiple {
    0% {
        -webkit-transform: scale(0);
        transform: scale(0);
        opacity: 0;
    }
    5% {
        opacity: 1;
    }
    100% {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 0;
    }
}

.loading-1 {
    position: relative;
    height: 100px;
    width: 100px;
    /* background-color: #000; */
}

.loading-1 > view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    opacity: 0;
    width: 60px;
    height: 60px;
    animation: ball-scale-multiple 1s 0s linear infinite;
    background-color: #ccc;
    border-radius: 100%;
}

.loading-1 > view:nth-of-type(2) {
    animation-delay: -0.4s;
}
.loading-1 > view:nth-of-type(3) {
    animation-delay: -0.2s;
}
</style>
