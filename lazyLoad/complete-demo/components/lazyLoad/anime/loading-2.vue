<template>
    <!-- https://connoratherton.com/loaders -->
    <view class='loading-2'>
        <view></view>
        <view></view>
        <view></view>
        <view></view>
        <view></view>
    </view>
</template>

<script>
export default {}
</script>

<style>
.loading-2> view:first-of-type,
.loading-2> view:nth-child(2) {
    width: 0;
    height: 0;
    border-right: 25px solid transparent;
    border-top: 25px solid #ccc;
    border-left: 25px solid #ccc;
    border-bottom: 25px solid #ccc;
    border-radius: 25px;
    position: relative;
    left: -30px;
}

@-webkit-keyframes rotate_pacman_half_up {
    0%,
    100% {
        -webkit-transform: rotate(270deg);
        transform: rotate(270deg);
    }

    50% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@keyframes rotate_pacman_half_up {
    0%,
    100% {
        -webkit-transform: rotate(270deg);
        transform: rotate(270deg);
    }

    50% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@-webkit-keyframes rotate_pacman_half_down {
    0%,
    100% {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
    }

    50% {
        -webkit-transform: rotate(0);
        transform: rotate(0);
    }
}

@keyframes rotate_pacman_half_down {
    0%,
    100% {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
    }

    50% {
        -webkit-transform: rotate(0);
        transform: rotate(0);
    }
}

@-webkit-keyframes pacman-balls {
    75% {
        opacity: 0.7;
    }

    100% {
        -webkit-transform: translate(-100px, -6.25px);
        transform: translate(-100px, -6.25px);
    }
}

@keyframes pacman-balls {
    75% {
        opacity: 0.7;
    }

    100% {
        -webkit-transform: translate(-100px, -6.25px);
        transform: translate(-100px, -6.25px);
    }
}

.loading-2{
    position: relative;
}

.loading-2> view:nth-child(3) {
    -webkit-animation: pacman-balls 1s -0.66s infinite linear;
    animation: pacman-balls 1s -0.66s infinite linear;
}

.loading-2> view:nth-child(4) {
    -webkit-animation: pacman-balls 1s -0.33s infinite linear;
    animation: pacman-balls 1s -0.33s infinite linear;
}

.loading-2> view:nth-child(5) {
    -webkit-animation: pacman-balls 1s 0s infinite linear;
    animation: pacman-balls 1s 0s infinite linear;
}

.loading-2> view:first-of-type {
    -webkit-animation: rotate_pacman_half_up 0.5s 0s infinite;
    animation: rotate_pacman_half_up 0.5s 0s infinite;
}

.loading-2> view:nth-child(2) {
    -webkit-animation: rotate_pacman_half_down 0.5s 0s infinite;
    animation: rotate_pacman_half_down 0.5s 0s infinite;
    margin-top: -50px;
}

.loading-2> view:nth-child(3),
.loading-2> view:nth-child(4),
.loading-2> view:nth-child(5),
.loading-2> view:nth-child(6) {
    background-color: #ccc;
    border-radius: 100%;
    margin: 2px;
    width: 10px;
    height: 10px;
    position: absolute;
    -webkit-transform: translate(0, -6.25px);
    transform: translate(0, -6.25px);
    top: 25px;
    left: 70px;
}
</style>
