import SquareObject from "./squareObject.js";
import Game from "../game.js";
import { moveToward } from "../movingObject.js";
import { Collider } from "../enums/enums.js";
import Virus from "./virus.js";

export default class BigVirus extends Virus {
    static collider = Collider.CIRCLE;

    constructor() {
        super();
        this.maxHealth = 250;
        this.health = this.maxHealth;
        this.length = 36;
        this.speed = 2;
        this.power = 2; // this value is decremented from the player when he touches the big viurs
        this.value = 4;
        this.deathSound = 'squash3';
        this.image = 'virus3';
    }

    shoot() {
        Game.instance.interactObjects.push(new Bullet(this));
    }

    interact() {
        Game.instance.player.takeHit(this.power);
    }

    takeHit(value) {
        this.health -= value;
        if (this.health <= 0) {
            this.die();
        }
        if (Game.gameFrames % 2 == 0) {
            moveToward(this, Game.instance.player.posX, Game.instance.player.posY, -(1));
        }
    }

    update() {        
        let newX = Game.instance.player.posX ;
        let newY = Game.instance.player.posY;

        let tx = newX - this.posX;
        let ty = newY - this.posY;
        let dist = Math.sqrt(tx * tx + ty * ty) - this.radius - Game.instance.player.radius;

        if (dist  > 200 && dist < 500) {
            moveToward(this, newX, newY, this.speed);
        } else if (dist <= 200) {
            if (Game.gameFrames % 50 === 0) {
                this.shoot();
            }    
        }
    }

    static clearBullets() {
        Game.instance.interactObjects = Game.instance.interactObjects.filter(io => !(io instanceof Bullet));
    }
}

class Bullet extends SquareObject {
    static collider = Collider.CIRCLE;

    constructor(object) {
        super();
        
        this.speed = 3; // maybe it should get slower over time ? well, maybe not.
        this.radius = 4;
        this.posX = object.posX;
        this.posY = object.posY;
        this.power = 20;

        let tx = Game.instance.player.posX - this.posX;
        let ty = Game.instance.player.posY - this.posY;
        let dist = Math.sqrt(tx * tx + ty * ty);
        this.velX = (tx / dist) * this.speed;
        this.velY = (ty / dist) * this.speed;
    }

    despawn() {
        Game.instance.interactObjects = Game.instance.interactObjects.filter(io => io !== this);
    }

    interact() {
        Game.instance.player.takeHit(this.power);
        this.despawn();
    }

    update() {
        this.posX += this.velX;
        this.posY += this.velY;

        // despawn when hitting the edge
        if (
            this.right > Game.instance.levelInstance.edge.right ||
            this.left < Game.instance.levelInstance.edge.left ||
            this.top < Game.instance.levelInstance.edge.top ||
            this.bottom > Game.instance.levelInstance.edge.bottom
        ) {
            this.despawn();
        }
    }

    draw() {
        Game.instance.ctxHelper.addCircle(this.posX, this.posY, this.radius, {color: 'purple'});
    }
}