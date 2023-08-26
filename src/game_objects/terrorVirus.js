import Game from "../game.js";
import { distance, RectCircleColliding } from "../engine/collision.js";
import { moveToward } from "../movingObject.js";
import { UpdatedAction } from "../engine/action.js";
import { Collider } from "../enums/enums.js";
import Virus from "./virus.js";

export default class TerrorVirus extends Virus {
    static collider = Collider.CIRCLE;

    constructor() {
        super();
        this.length = 20;
        this.power = 5;
        this.speed = 6;
        this.maxHealth = 50;
        this.health = 50;
        this.value = 2;
        this.deathSound = 'squash1';
        this.image = 'virus2';
        
        this.explodeRadius = 150;
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
                Game.instance.ctxHelper.addCircle(this.obj.posX, this.obj.posY, this.obj.radius, {
                    color: "rgba(106, 55, 55, .4)"
                });
            },
            {posX: this.posX, posY: this.posY, radius: 1, rate: 2}
        );
        action.activate();
        Game.instance.actionManager.updatedActions.push(action);
        Game.instance.onVirusKill(this);
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
}