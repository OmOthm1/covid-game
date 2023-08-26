import { distance, circleCircleColliding } from "../engine/collision.js";
import { UpdatedAction } from "../engine/action.js";
import HealthBar from "./healthBar.js";
import Game from "../game.js";
import { moveToward } from "../movingObject.js";
import SquareObject from "./squareObject.js";
import { Collider, TextAlign, TextBaseLine } from "../enums/enums.js";

export default class Virus extends SquareObject {
    static collider = Collider.CIRCLE;

    speed;
    maxHealth;
    health;
    value;
    damage;
    power;
    healthBar;
    deathSound;
    image;

    constructor() {
        super();

        this.radius = 10;
        this.speed = 4;
        this.maxHealth = 100;
        this.health = 100;
        this.value = 1;
        this.damage = 1;
        this.power = 1;

        this.healthBar = new HealthBar(this);
        this.healthBar.fgColor = 'red';
    }

    die() {
        Game.instance.onVirusKill(this);
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
    }

    interact() {
        throw new Error('Subclasses must implement "interact" method');
    }

    update() {
        throw new Error('Subclasses must implement "update" method');
    }

    draw() {
        Game.instance.ctxHelper.addImage(this.image, this.left, this.top, this.width, this.height);
        this.drawHealthBar();
    }

    drawHealthBar() {
        if (this.health < this.maxHealth) {
            this.healthBar.draw();
        }
    }
}