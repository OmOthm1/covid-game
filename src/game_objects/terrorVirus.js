import Game from "../game.js";
import { distance, RectCircleColliding } from "../engine/collision.js";
import { moveToward } from "../movingObject.js";
import SquareObject from "./squareObject.js";
import { UpdatedAction } from "../engine/action.js";
import ImageManager from "../engine/imageManager.js";
import HealthBar from "./healthBar.js";
import BasicEnemy from "./basicVirus.js";
import SoundManager from "../engine/soundManager.js";
import HealthObject from "./healthObject.js";
import { Powerup } from "./powerup.js";

export default class TerrorVirus extends SquareObject {
    static collider = 'circle';

    constructor() {
        super();
        this.length = 20;
        this.posX = 100;
        this.posY = 100;
        this.power = 5;
        this.speed = 6;
        this.maxHealth = 50;
        this.health = 50;
        this.explodeRadius = 150;
        this.value = 2;

        this.healthBar = new HealthBar(this);
    }

    takeHit(value) {
        this.health -= value;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        // check if player in range of explosion
        let lastPlayerData = {
            left: Game.instance.player.left,
            top: Game.instance.player.top,
            length: Game.instance.player.length
        };

        Game.instance.enemies = Game.instance.enemies.filter(e => e !== this); // despawn
        BasicEnemy.playPointsAnimation(this);
        SoundManager.play('squash1');

        let that = this;
        let action = new UpdatedAction(500,
            function onActivate() {
                this.obj.lastPlayerData = lastPlayerData;
            },
            function onDisactivate() {
                // HealthObject.push(that);
            },
            function update() {
                this.obj.radius += this.obj.rate;
                
                if (this.obj.radius >= that.explodeRadius) {
                    this.obj.radius = that.explodeRadius;
                    this.disActivate();
                }

                if (RectCircleColliding({posX: this.obj.posX, posY: this.obj.posY, radius: this.obj.radius}, Game.instance.player)) {
                    Game.instance.player.takeHit(that.power);
                }

                this.obj.rate *= 1.1;
            },
            function draw() {
                Game.ctx.beginPath();
                Game.ctx.arc(this.obj.posX, this.obj.posY, this.obj.radius, 0, 2 * Math.PI);
                Game.ctx.fillStyle = "rgba(106, 55, 55, .4)";
                Game.ctx.fill();
            },
            {posX: this.posX, posY: this.posY, radius: 1, rate: 2}
        );
        action.activate();
        Game.instance.actionManager.updatedActions.push(action);

        let result = Game.instance.player.addToRecentKills(this.value);
        if (result) {
            Game.instance.powerups.array.push(new Powerup())
        } else {
            HealthObject.push(this);
        }
    }

    interact() {
        this.die();
    }

    update() {
        let newX = Game.instance.player.posX;
        let newY = Game.instance.player.posY;

        if (distance(this.posX, this.posY, newX, newY) + this.radius < 300) {
            moveToward(this, newX, newY, this.speed);
        }
    }

    draw() {
        Game.ctx.drawImage(ImageManager.get('virus2'), this.left, this.top, this.width, this.height);
        if (this.health < this.maxHealth) {
            this.healthBar.draw();
        }
    }
}