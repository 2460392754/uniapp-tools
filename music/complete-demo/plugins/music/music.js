/*
 * @Description: uniapp music v1.0.1
 * @Author pocky
 * @Email 2460392754@qq.com
 * @Date: 2019-08-13 ‏‎14:54:53
 * @LastEditTime: 2019-08-07 16:43:36
 * @instruction https://www.yuque.com/pocky/aaeyux/gflqlz
 * @github https://github.com/2460392754/uniapp-tools/tree/master/music
 * @dcloud http://ext.dcloud.net.cn/plugin?id=704
 */


// 1·      时间*1.5
// 弧线    中间没有停顿
// |       dealy
// -       2分音符, dealy
// ---     全音符, 3个dealy
// 0       停顿, stop
// _       时间*0.5
// 两条_   时间*0.25


class MyMusic {
    constructor() {
        _.audioCtx = new AudioContext();
    }

    getVoice () {
        return _.voiceList;
    }

    setVoice (arr) {
        _.voiceList = arr;
    }

    getMusicScore () {
        return _.musicScore;
    }

    setMusicScore (arr) {
        _.musicScore = arr;
    }

    // 开始
    async start () {
        const musicScore = this.getMusicScore();

        for (const item of musicScore) {
            const { delay, stop, level, index } = item;
            let time = item.time || 1;

            if (!_.isPlay) await _.watchIsPlay();
            if (delay) continue;

            _.stopAudio();

            if (stop) {
                await _.sleep(500 * time);
                // await _.sleep(500);
                continue;
            };

            await _.sleep(50);

            _.playAudio(level - 1, index - 1)
            _.prevVoice = _.voiceObj[level - 1][index - 1];

            await _.sleep(500 * time);
        }

        await _.sleep(50);
        _.stopAudio();
    }

    // 播放
    play () {
        _.isPlay = true;

        _.loopVoiceObj(voice => {
            voice.gainNode.gain.value = 1;
            // voice.oscillator.start(0, 0);
        })
    }

    // 暂停
    stop () {
        _.isPlay = false;

        _.loopVoiceObj(voice => {
            voice.gainNode.gain.value = 0;
            voice.oscillator.stop();
        })
    }
}

var _ = {
    // audio上下文
    audioCtx: null,

    // 创建音调控制对象
    oscillator: null,

    // 创建音量控制对象
    gainNode: null,

    // 歌曲的简谱
    musicScore: [],

    // 简谱、乐谱
    voiceList: [],

    // 简谱对象
    voiceObj: {},

    // 上一个简谱对象
    prevVoice: null,

    // 是否播放
    isPlay: true,

    playAudio (level, index) {
        // 初始化
        _.voiceObj[level] || (_.voiceObj[level] = {})
        _.voiceObj[level][index] || (_.voiceObj[level][index] = {})

        const l = _.voiceObj[level];
        const { currentTime } = _.audioCtx;

        // 如果之前正在播，那就清掉之前的音频
        l[index].gainNode && l[index].gainNode.gain.setValueAtTime(0, currentTime);
        l[index].oscillator && l[index].oscillator.stop(currentTime + 1);

        // 创建音调控制对象
        l[index].oscillator = _.audioCtx.createOscillator();

        // 创建音量控制对象
        l[index].gainNode = _.audioCtx.createGain();

        // 音调音量关联
        l[index].oscillator.connect(l[index].gainNode);

        // 音量和设备关联
        l[index].gainNode.connect(_.audioCtx.destination);

        // 音调类型指定为正弦波。sin好听一些(sine, sawtooth, triangle, square)
        // l[index].oscillator.type = "sine";
        l[index].oscillator.type = "triangle";

        // 设置音调频率
        l[index].oscillator.frequency.value = _.voiceList[level][index];

        // 先把当前音量设为0
        l[index].gainNode.gain.setValueAtTime(0, currentTime);

        // 0.01秒时间内音量从刚刚的0变成1，线性变化
        l[index].gainNode.gain.linearRampToValueAtTime(1, currentTime + 0.01);

        // 声音开始
        l[index].oscillator.start(currentTime);
    },

    stopAudio () {
        const { currentTime } = _.audioCtx;

        if (!_.prevVoice) return;

        // 0.8秒后停止声音
        _.prevVoice.gainNode && _.prevVoice.gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.8);
        _.prevVoice.oscillator && _.prevVoice.oscillator.stop(currentTime + 0.8);
        // _.prevVoice.oscillator = _.prevVoice.gainNode = null;
    },

    watchIsPlay () {
        return new Promise(resolve => {
            _.watch('isPlay', {
                set (val) {
                    val && resolve()
                }
            })
        })
    },

    // 暂停
    sleep (delay = 80) {
        return new Promise(resolve => {
            setTimeout(resolve, delay)
        })
    },

    // 数据监听
    watch (name, { get: _get, set: _set }) {
        let tmpVal = _[name];

        Object.defineProperty(_, name, {
            get () {
                _get && _get();
                return tmpVal;
            },
            set (newVal) {
                _set && _set(newVal);
                tmpVal = newVal
            }
        });
    },

    loopVoiceObj (callback) {
        for (const item of Object.values(_.voiceObj)) {
            for (const voice of Object.values(item)) {
                callback && callback(voice)
            }
        }
    }
}

export default MyMusic;