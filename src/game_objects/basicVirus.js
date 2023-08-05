import ImageManager from "../engine/imageManager.js";
import { distance, circleCircleColliding } from "../engine/collision.js";
import { UpdatedAction } from "../engine/action.js";
import { FONT } from "../engine/preferences.js";
import HealthBar from "./healthBar.js";
import Game from "../game.js";
import { moveToward } from "../movingObject.js";
import CircleObject from "./squareObject.js";
import SoundManager from "../engine/soundManager.js";
import HealthObject from "./healthObject.js";
import { Powerup } from "./powerup.js";
import { Collider, TextAlign, TextBaseLine } from "../enums/enums.js";

export default class BasicVirus extends CircleObject {
    static collider = Collider.CIRCLE;
    static maxRadius = 150;
    static maxHealth = 1000;

    constructor() {
        super();

        this.radius = 10;
        this.speed = 4;
        this.maxHealth = 100;
        this.health = 100;
        this.value = 1;
        this.merged = false;
        this.damage = 1;
        this.power = 1;

        this.healthBar = new HealthBar(this);
        this.healthBar.fgColor = 'red';
    }

    die() {
        Game.instance.enemies = Game.instance.enemies.filter(e => e !== this);
        SoundManager.play('squash2');
        BasicVirus.playPointsAnimation(this);

        let result = Game.instance.player.addToRecentKills(this.value);
        if (result) {
            Game.instance.powerups.array.push(new Powerup())
        } else {
            HealthObject.push(this);
        }
    }

    static playPointsAnimation(object) {
        const player = Game.instance.player;

        let action = new UpdatedAction(500,
            function onActivate() {
                this.obj.posX = object.posX;
                this.obj.posY = object.posY;
            },
            function onDisactivate() {
                player.increaseKills(object.value * player.multiply);
            },
            function update() {
                if (Game.gameFrames < this.start + 20) {
                    return;
                }

                this.obj.speed *= 1.02;
                let newX = Game.instance.status.positions.kills.x + Game.instance.status.iconWidth;
                let newY = Game.instance.status.positions.kills.y + Game.instance.status.iconWidth;

                if (distance(this.obj.posX, this.obj.posY, newX, newY) < 20) {
                    this.disActivate();
                    return;
                }

                moveToward(this.obj, newX, newY, this.obj.speed);
            },
            function draw() {
                Game.instance.ctxHelper.addText(`+${object.value * player.multiply}`, this.obj.posX, this.obj.posY, {
                    fontSize: 16,
                    color: 'green',
                    textAlign: TextAlign.CENTER,
                    textBaseline: TextBaseLine.MIDDLE
                });
            }, { speed: 10 }
        );
        action.activate();
        Game.instance.actionManager.updatedActions.push(action);
    }

    takeHit(value) {
        this.health -= value;
        if (this.health <= 0) {
            this.die();
        }
        moveToward(this, Game.instance.player.posX, Game.instance.player.posY, -(this.speed + 1.5));
    }

    interact() {
        Game.instance.player.takeHit(this.power);
    }

    update() {
        if (this.merged) {
            return;
        }

        Game.instance.enemies.forEach(enemy => {
            if (enemy === this || !(enemy instanceof BasicVirus)) {
                return;
            }
            if (enemy.value + this.value > 6) {
                return;
            }

            if (circleCircleColliding(this, enemy)) {
                this.health += enemy.health;
                this.maxHealth += enemy.maxHealth;
                this.value += enemy.value;

                if (enemy.radius > this.radius) {
                    this.posX = enemy.posX;
                    this.posY = enemy.posY;

                    this.radius = enemy.radius;
                }

                // grow animation
                let growAction = new UpdatedAction(1000,
                    function onActivate() {
                        if (this.obj.goal > BasicVirus.maxRadius) {
                            this.obj.goal = BasicVirus.maxRadius;
                        }
                    },
                    function ondisactivate() {
                    },
                    function update() {
                        if (this.obj.enemy.radius + this.obj.rate < this.obj.goal) {
                            this.obj.enemy.radius += this.obj.rate;
                        } else {
                            this.obj.enemy.radius = this.obj.goal;
                            this.disActivate();
                        }
                    },
                    function draw() {
                    }, { enemy: this, goal: Math.sqrt(this.radius * this.radius + enemy.radius * enemy.radius), rate: 2 }
                );
                growAction.activate();
                Game.instance.actionManager.updatedActions.push(growAction);


                enemy.merged = true;
                Game.instance.enemies = Game.instance.enemies.filter(e => !e.merged);
            }
        });

        let newX = Game.instance.player.posX;
        let newY = Game.instance.player.posY;

        let tx = newX - this.posX;
        let ty = newY - this.posY;
        let dist = Math.sqrt(tx * tx + ty * ty);

        if (dist - this.radius < 300 && dist - this.radius > Game.instance.player.radius) {
            moveToward(this, newX, newY, this.speed);
        }
    }

    draw() {
        Game.instance.ctxHelper.addImage('virus1', this.left - this.length * .1, this.top - this.length * .1, this.length * 1.2, this.length * 1.2);

        // health bar
        if (this.health < this.maxHealth) {
            this.healthBar.draw();
        }
    }
}