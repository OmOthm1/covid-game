export default class SoundManager {
    static sounds = {
        'music': {
            audio: new Audio('./assets/sounds/music.mp3'),
            volume: 0.3,
            overlap: false,
            loop: true
        },
        'foom': {
            audio: new Audio('./assets/sounds/foom.wav'),
            volume: 0.4,
            overlap: true,
            loop: false
        },
        'collect':  {
            audio: new Audio('./assets/sounds/collect.wav'),
            volume: 1.0,
            overlap: false,
            loop: false
        },
        'rollover': {
            audio: new Audio('./assets/sounds/rollover.wav'),
            volume: 1.0,
            overlap: false,
            loop: false
        },
        'squash2': {
            audio: new Audio('./assets/sounds/bite-small.wav'),
            volume: 1.0,
            overlap: true,
            loop: false
        },
        'squash1': {
            audio: new Audio('./assets/sounds/slime-long.wav'),
            volume: 1.0,
            overlap: true,
            loop: false
        },
        'squash3': {
            audio: new Audio('./assets/sounds/slime-short.wav'),
            volume: 1.0,
            overlap: true,
            loop: false
        }
    };

    static SFX_playing = true;

    static configure() {
        Object.values(SoundManager.sounds).forEach(sound => {
            sound.audio.loop = sound.loop;
            sound.audio.volume = sound.volume;
        });
    }

    static play(id) {
        if (SoundManager.sounds[id].overlap) {
            const clone = SoundManager.sounds[id].audio.cloneNode();
            clone.volume = SoundManager.sounds[id].volume;
            clone.play();
        } else {
            SoundManager.sounds[id].audio.play();
        }
    }

    static mute(id) {
        SoundManager.sounds[id].audio.pause();
    }

    static isPlaying(id) {
        return !SoundManager.sounds[id].audio.paused;
    }

    static toggle(id) {
        if (SoundManager.isPlaying(id)) {
            SoundManager.mute(id);
        } else {
            SoundManager.play(id);
        }
    }

    static toggleSFX() {
        for (let [key, value] of Object.entries(SoundManager.sounds)) {
            if (key !== 'music') {
                if (SoundManager.SFX_playing) {
                    value.audio.pause();
                } else {
                    value.audio.play();
                }
            }
        }
    }
}