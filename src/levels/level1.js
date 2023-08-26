import BasicVirus from '../game_objects/basicVirus.js';
import TerrorVirus from '../game_objects/terrorVirus.js';
import { UpdatedAction } from '../engine/action.js';
import ImageManager from '../engine/imageManager.js';
import Game from '../game.js';
import BigVirus from '../game_objects/bigVirus.js';

export default class Level1 {
    constructor() {
        this.virusSpawnInterval = 100;

        this.hardObjects = [];
        this.interactObjects = [];

        this.edge = {
            top: 0,
            right: Game.WIDTH,
            bottom: Game.HEIGHT,
            left: 0,
        };

        this.percentage = {
            basicVirus: 1.0,
            terrorVirus: 1.0,
        };
    }

    /**
     * called when the number of kills changes.
     */
    killsChanged() {
        // SPAWN FREQUENCY UPDATE
        // every (spawnInterval) an enemy spawns
        // max is 80, min is 15
        // max reached at 800

        this.virusSpawnInterval = Math.max(100 - Math.round((100 * (Math.min(Game.instance.player.kills, 1000) / 1000))), 20);

        // VIRUS TYPES APPEARANCE TIME
        // less than 50 kills => (basic virus)
        // after 50 => (terror virus)
        // after 150 => (big virus)
        if (Game.instance.player.kills > 50 && Game.instance.player.kills <= 150) {
            this.percentage.basicVirus = 0.5;
        } else if (Game.instance.player.kills > 150 && Game.instance.player.kills) {
            this.percentage.basicVirus = 0.33;
            this.percentage.terrorVirus = 0.66;
        }
    }

    reset() {
        // reset player positon
        Game.instance.player.posX = Game.WIDTH / 2;
        Game.instance.player.posY = Game.HEIGHT / 2;
        BigVirus.clearBullets();

        // reset frequency
        this.virusSpawnInterval = 100;
        this.percentage.basicVirus = 1.0;
        this.percentage.terrorVirus = 1.0;
    }

    spawnEnemy() {
        if (Game.instance.enemies.length > 50) { // maximum number of viruses on screen is 50
            return;
        }

        let random = Math.random();
        let virus;
        if (random < this.percentage.basicVirus) {
            virus = new BasicVirus();
        } else if (random < this.percentage.terrorVirus) {
            virus = new TerrorVirus();
        } else if (random < 1.0) {
            virus = new BigVirus();
        }

        let spawnAction = new UpdatedAction(50,
            function onActivate() {
                this.obj.enemy.left = Math.floor(Math.random() * (Game.WIDTH - this.obj.enemy.length));
                this.obj.enemy.top = Game.instance.status.barHeight + Math.floor(Math.random() * (Game.HEIGHT - this.obj.enemy.length - Game.instance.status.barHeight));
            },
            function onDisactivate() {
                Game.instance.enemies.push(this.obj.enemy);
            },
            function update() {
                if (Game.gameFrames % 5 === 0) {
                    this.obj.randomX = Math.floor(Math.random() * 15);
                }
            },
            function draw() {
                Game.ctx.drawImage(ImageManager.get('warning'), this.obj.enemy.left + this.obj.randomX, this.obj.enemy.top, 5, 20);
            }, { enemy: virus, randomX: 0 }
        );
        spawnAction.activate();
        Game.instance.actionManager.updatedActions.push(spawnAction);
    }

    update() {
        if (Game.gameFrames % this.virusSpawnInterval === 0) {
            this.spawnEnemy();
        }

        const powerUpSpawnInterval = 500;
        if (Game.frames % powerUpSpawnInterval === 0 && Math.random() < .20) {
            Game.instance.spawnPowerup();
        }
    }

    draw() {
        Game.ctx.drawImage(ImageManager.get('concrete'), 0, 0);
    }
}
