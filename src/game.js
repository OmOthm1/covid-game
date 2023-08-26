import InputHandler from './engine/input.js';
import Player from './game_objects/player.js';
import Menu from './states/menu/menu.js';
import Powerups, { Powerup } from './game_objects/powerup.js';
import Status from './status.js';
import GameOver from './states/gameOver.js';
import PauseScreen from './states/pauseScreen.js';
import Level1 from './levels/level1.js';
import ActionManager from './engine/action.js';
import Settings from './engine/settings.js';
import { GameState } from './enums/enums.js';
import { CtxHelper } from './engine/ctxHelper.js';
import HealthObject from './game_objects/healthObject.js';
import SoundManager from './engine/soundManager.js';
import Virus from './game_objects/virus.js';


export default class Game {
    /**@type {Game} */
    static instance;

    /**@type {CanvasRenderingContext2D} */
    static ctx;

    /**@type {number} */
    static frames = 0;

    /**@type {number} */
    static gameFrames = 0;

    /**@type {number} */
    static WIDTH;

    /**@type {number} */
    static HEIGHT;

    /**@type {number} */
    static bestScore = 0;

    /**@type {Settings} */
    settings;
    
    /**@type {GameState} */
    gameState;

    /**@type {ActionManager} */
    actionManager;

    /**@type {Player} */
    player;

    /**@type {Status} */
    status;

    /**@type {GameOver} */
    gameOver;

    /**@type {PauseScreen} */
    pauseScreen;

    /**@type {Powerups} */
    powerups;

    /**@type {CtxHelper} */
    ctxHelper;


    constructor(canvas) {
        if (Game.instance) {
            throw new Error("New Instance can't be created from a singleton.")
        }

        Game.instance = this;
        Game.ctx = canvas.getContext('2d');
        Game.WIDTH = canvas.width;
        Game.HEIGHT = canvas.height;

        this.settings = new Settings();
        this.gameState = GameState.MENU;
        this.actionManager = new ActionManager();
        this.player = new Player();
        this.menu = new Menu();
        this.status = new Status();
        this.gameOver = new GameOver();
        this.pauseScreen = new PauseScreen();
        this.ctxHelper = new CtxHelper(Game.ctx);

        this.levels = [
            // new HomeLevel(),
            new Level1()
        ];
        this.level = -1;

        this.powerups = new Powerups();
        new InputHandler();
        this.initListeners();
    }

    start() {
        this.gameState = GameState.RUNNING;
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
            case GameState.RUNNING:
                this.levels[this.level].update();
                [...this.enemies, ...this.interactObjects, this.player, this.powerups, this.actionManager].forEach((object) => object.update());

                if (this.level !== 0) {
                    this.status.update();
                }
                break;

            case GameState.MENU:
                this.menu.update();
                break;
            
            case GameState.GAMEOVER:
                this.gameOver.update();
                break;
            
            case GameState.PAUSED:
                this.pauseScreen.update();
                break;
        }
    }

    draw() {
        switch (this.gameState) {
            case GameState.PAUSED:
                // break;

            case GameState.RUNNING:
                this.levels[this.level].draw();
                [...this.enemies, ...this.interactObjects, this.player, this.powerups, this.actionManager].forEach((object) => object.draw());

                if (this.gameState === GameState.PAUSED) {
                    this.pauseScreen.draw();
                }
                
                // if (this.level !== 0) {
                    this.status.draw();
                // }
                break;

            case GameState.MENU:
                this.menu.draw();
                break;
            
            case GameState.GAMEOVER:
                this.gameOver.draw();
                break;
        }

        this.status.drawSoundIcon();
    }

    initListeners() {
        InputHandler.keyDownListeners['Space'] = (event) => {
            event.preventDefault();

            if (Game.instance.gameState === GameState.RUNNING) {
                if (!InputHandler.keyDown['Space'] && !InputHandler.keyDown.mouse) {
                    Game.instance.player.fireCircle.spaceDownStarted();
                }
            }
        };

        InputHandler.keyDownListeners['ArrowDown'] = (event) => {
            event.preventDefault();
        };

        InputHandler.keyUpListeners['KeyM'] = (event) => {
            SoundManager.toggle('music');
        };

        InputHandler.keyUpListeners['KeyP'] = (event) => {
            if (Game.instance.gameState === GameState.RUNNING) {
                Game.instance.gameState = GameState.PAUSED;
            } else if (Game.instance.gameState === GameState.PAUSED) {
                Game.instance.gameState = GameState.RUNNING;
            }
        };

        InputHandler.keyUpListeners['Space'] = (event) => {
            switch (Game.instance.gameState) {
                case GameState.RUNNING:
                    Game.instance.player.fireCircle.spaceDownEnded();
                    if (InputHandler.keyDown.mouse) {
                        Game.instance.player.fireCircle.spaceDownStarted();
                    }
                    break;

                case GameState.MENU:
                    Game.instance.menu.renderedButtonList.clickFocused();
                    break;

                case GameState.GAMEOVER:
                    Game.instance.gameOver.buttonList.clickFocused();
                    break;
            };
        }

        InputHandler.keyUpListeners['ArrowDown'] = (event) => {
            if (Game.instance.gameState === GameState.MENU) {
                Game.instance.menu.renderedButtonList.focusNext();
            }
        };

        InputHandler.keyUpListeners['ArrowUp'] = (event) => {
            if (Game.instance.gameState === GameState.MENU) {
                Game.instance.menu.renderedButtonList.focusPrev();
            }
        };
    }

    spawnPowerup() {
        this.powerups.array.push(new Powerup());
    }

    onVirusKill(virus) {
        this.enemies = this.enemies.filter(e => e !== virus);
        SoundManager.play(virus.deathSound);
        Virus.playPointsAnimation(virus);

        let result = this.player.addToRecentKills(virus.value);

        if (result) {
            this.spawnPowerup();
        } else {
            HealthObject.push(virus);
        }

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
}