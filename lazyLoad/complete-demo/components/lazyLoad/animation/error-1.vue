<template>
    <view class='error-1'>
        <view></view>
        <view></view>
    </view>
</template>

<script>
export default {}
</script>

<style scoped>
@keyframes anime {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    80% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.error-1 {
    position: relative;
    width: 100px;
    height: 100px;
}

.error-1 > view {
    position: absolute;
    width: 40%;
    height: 40%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}

.error-1 > view:first-of-type {
    border-radius: 100%;
    border: 5px solid #ed4014;
    animation: anime 1.5s ease-in-out;
}

.error-1 > view:last-of-type {
    transform: rotate(-45deg);
}

.error-1 > view:last-of-type::after,
.error-1 > view:last-of-type::before {
    content: "";
    background: #ed4014;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    animation: anime 2s ease-in-out;
}

.error-1 > view:last-of-type::after {
    width: 30px;
    height: 5px;
}

.error-1 > view:last-of-type::before {
    width: 5px;
    height: 30px;
}
</style>
