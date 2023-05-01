import ImageManager from './engine/imageManager.js';
import SoundManager from './engine/soundManager.js';
import Game, { gameState } from './game.js';

export var isMobile = false;
if (/Mobi/.test(navigator.userAgent)) {
    isMobile = true;
}

const canvas = document.getElementById("gameScreen");

let ctx = canvas.getContext('2d');

SoundManager.configure();
ImageManager.configure();

let game = new Game(canvas, ctx);
Game.WIDTH = canvas.width;
Game.HEIGHT = canvas.height;
SoundManager.play('music');

function gameLoop() {
    // game.earse();
    game.update();
    game.draw();
    Game.frames++;
    if (game.gameState === gameState.RUNNING) {
        Game.gameFrames++;
    }
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
