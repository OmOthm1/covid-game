import { distance, circleCircleColliding } from "../engine/collision.js";
import { UpdatedAction } from "../engine/action.js";
import Game from "../game.js";
import { moveToward } from "../movingObject.js";
import { Collider, TextAlign, TextBaseLine } from "../enums/enums.js";
import Virus from "./virus.js";

export default class BasicVirus extends Virus {
    static collider = Collider.CIRCLE;
    static maxRadius = 150;
    static maxHealth = 1000;

    constructor() {
        super();

        this.radius = 12;
        this.speed = 4;
        this.maxHealth = 100;
        this.health = 100;
        this.value = 1;
        this.damage = 1;
        this.power = 1;
        this.image = 'virus1';
        this.deathSound = 'squash2';

        this.merged = false;
    }

    die() {
        Game.instance.onVirusKill(this);
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

}