import Music from './music';
import Song from './song/cityOfSky'

const music = new Music();

music.setVoice([
    [261.63, 293.67, 329.63, 349.23, 391.99, 440, 493.88],
    [523.25, 587.33, 659.26, 698.46, 783.99, 880, 987.77],
    [1046.5, 1174.66, 1318.51, 1396.92, 1567.98, 1760, 1975.52]
]);

music.setMusicScore(Song)

export default music;