import ImageManager from './engine/imageManager.js';
import SoundManager from './engine/soundManager.js';
import Game from './game.js';
import { GameState } from './enums/enums.js';

export var isMobile = false;
if (/Mobi/.test(navigator.userAgent)) {
    isMobile = true;
}

const canvas = document.getElementById("gameScreen");

SoundManager.configure();
ImageManager.configure();

let game = new Game(canvas);
SoundManager.play('music');

function gameLoop() {
    // game.earse();
    game.update();
    game.draw();
    Game.frames++;
    if (game.gameState === GameState.RUNNING) {
        Game.gameFrames++;
    }
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);