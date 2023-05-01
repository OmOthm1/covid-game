import SquareObject from "./squareObject.js";
import Game from "../game.js";
import HealthBar from "./healthBar.js";
import BasicVirus from "./basicVirus.js";
import HealthObject from "./healthObject.js";
import { moveToward } from "../movingObject.js";
import SoundManager from "../engine/soundManager.js";
import ImageManager from "../engine/imageManager.js";
import { Powerup } from "./powerup.js";

export default class BigVirus extends SquareObject {
    static collider = 'circle';

    constructor() {
        super();
        this.maxHealth = 250;
        this.health = this.maxHealth;
        this.length = 30;
        this.speed = 2;
        this.power = 2; // this value is decremented from the player when he touches the big viurs
        this.healthBar = new HealthBar(this);
        this.value = 4;
    }

    shoot() {
        Game.instance.interactObjects.push(new Bullet(this));
    }

    die() {
        Game.instance.enemies = Game.instance.enemies.filter(e => e !== this);
        SoundManager.play('squash3');
        BasicVirus.playPointsAnimation(this);

        let result = Game.instance.player.addToRecentKills(this.value);
        if (result) {
            Game.instance.powerups.array.push(new Powerup())
        } else {
            HealthObject.push(this);
        }
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

    draw() {
        Game.ctx.drawImage(ImageManager.get(`virus3`), this.left-this.length*.1, this.top-this.length*.1, this.length*1.2, this.length*1.2);
        if (this.health < this.maxHealth) {
            this.healthBar.draw();
        }
    }

    static clearBullets() {
        Game.instance.interactObjects = Game.instance.interactObjects.filter(io => !(io instanceof Bullet));
    }
}

class Bullet extends SquareObject {
    static collider = 'circle';

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
        Game.ctx.beginPath();
        Game.ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
        Game.ctx.fillStyle = 'purple';
        Game.ctx.fill();
    }
}