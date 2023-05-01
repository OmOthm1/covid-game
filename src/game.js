import InputHandler from './engine/input.js';
import Player from './game_objects/player.js';
import Menu from './states/menu/menu.js';
import Powerups from './game_objects/powerup.js';
import Status from './status.js';
import GameOver from './states/gameOver.js';
import PauseScreen from './states/pauseScreen.js';
import HomeLevel from './levels/homeLevel.js';
import Level1 from './levels/level1.js';
import ActionManager from './engine/action.js';
import Settings from './engine/settings.js';

export const gameState = {
    MENU: 0,
    RUNNING: 1,
    GAMEOVER: 2,
    PAUSED: 3
};

export default class Game {
    static instance;
    static ctx;
    static frames = 0;
    static gameFrames = 0;
    static WIDTH;
    static HEIGHT;
    static bestScore = 0;

    constructor(canvas, ctx) {
        Game.instance = this;
        Game.ctx = ctx;
        Game.WIDTH = canvas.width;
        Game.HEIGHT = canvas.height;

        this.settings = new Settings();
        this.gameState = gameState.MENU;
        this.actionManager = new ActionManager();
        this.player = new Player();
        this.menu = new Menu();
        this.status = new Status();
        this.gameOver = new GameOver();
        this.pauseScreen = new PauseScreen();
        this.levels = [
            // new HomeLevel(),
            new Level1()
        ];
        this.level = -1;

        this.powerups = new Powerups();
        new InputHandler();
    }

    start() {
        this.gameState = gameState.RUNNING;
        this.player.reset();
        this.level = -1;
        this.moveToNextLevel();
    }

    moveToNextLevel() {
        this.level++;
        this.levels[this.level].reset();
        this.powerups.reset();
        this.hardObjects = this.levels[this.level].hardObjects;
        this.actionManager.clearAll();
        this.enemies = [];
    }

    earse() {
        // Game.ctx.clearRect(0, 0, this.width, this.height);
    }

    update() {
        switch (this.gameState) {
            case gameState.RUNNING:
                this.levels[this.level].update();
                [...this.enemies, ...this.interactObjects, this.player, this.powerups, this.actionManager].forEach((object) => object.update());

                if (this.level !== 0) {
                    this.status.update();
                }
                break;

            case gameState.MENU:
                this.menu.update();
                break;
            
            case gameState.GAMEOVER:
                this.gameOver.update();
                break;
            
            case gameState.PAUSED:
                this.pauseScreen.update();
                break;
        }
    }

    draw() {
        switch (this.gameState) {
            case gameState.PAUSED:
                // break;

            case gameState.RUNNING:
                this.levels[this.level].draw();
                [...this.enemies, ...this.interactObjects, this.player, this.powerups, this.actionManager].forEach((object) => object.draw());

                if (this.gameState === gameState.PAUSED) {
                    this.pauseScreen.draw();
                }
                
                // if (this.level !== 0) {
                    this.status.draw();
                // }
                break;

            case gameState.MENU:
                this.menu.draw();
                break;
            
            case gameState.GAMEOVER:
                this.gameOver.draw();
                break;
        }

        this.status.drawSoundIcon();
    }

    get levelInstance() {
        return this.levels[this.level];
    }

    get interactObjects() {
        return this.levelInstance.interactObjects;
    }

    set interactObjects(value) {
        this.levelInstance.interactObjects = value;
    }

    static submitScoreToDB(name, score) {
        console.log('tried to submit');
        jQuery.ajax({
            type: "POST",
            url: 'submitScore.php',
            dataType: 'json',
            data: {
                name,
                score
            },
            success: function(obj, textstatus) {
                if (!('error' in obj)) {
                    console.log(obj['saved']);
                    // code if score is successfully submitted
                } else {
                    console.log(obj.error);
                }
            }
        });

    }
}