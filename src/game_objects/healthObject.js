import SquareObject from "./squareObject.js";
import Game from "../game.js";
import { OnOffAction } from "../engine/action.js";
import { distance } from "../engine/collision.js";
import { moveToward } from "../movingObject.js";
import { Collider } from "../enums/enums.js";

export default class HealthObject extends SquareObject {
    static collider = Collider.RECTANGLE;

    constructor(object) {
        super();
        this.posX = object.posX + Math.random() * 30 - 15;
        this.posY = object.posY + Math.random() * 30 - 15;

        // value => health gain range
        // 1     => 5 - 15
        // 2     => 10 - 20
        // 10    => 90 - 100
        this.value = object.value*5 + Math.random()*10;
        this.length = Math.min(Math.max(this.value, 9), 30);
    }

    interact() {
        Game.instance.player.health += this.value;
        Game.instance.player.healing = true;
        Game.instance.interactObjects = Game.instance.interactObjects.filter(ho => ho !== this);
    }

    update() {
        let newX = Game.instance.player.posX;
        let newY = Game.instance.player.posY;
        if (distance(this.posX, this.posY, newX, newY) - this.radius - Game.instance.player.radius < 50) {
            moveToward(this, newX, newY, 6);
        }
    }

    draw() {
        let l = this.length/3; // width, height = l*3
        let x = this.left + l;
        let y = this.top;
        let path = new Path2D(`M${x} ${y} h ${l} v ${l} h ${l} v ${l} h -${l} v ${l} h -${l} v -${l} h -${l} v -${l} h ${l} Z`);
        Game.ctx.fillStyle = 'rgb(0, 170, 0)';
        Game.ctx.strokeStyle = 'rgb(0, 100, 0)';
        Game.ctx.fill(path);
        Game.ctx.stroke(path);
        
    }

    /**
     * Add a HealthObject in place of an object.
     * 
     * @param {HealthObject} object 
     */
    static push(object) {
        
        // don't spawn a health object if the player is at full health
        if (Game.instance.player.health === Game.instance.player.maxHealth)
            return;

        // 50% posibblity for the health object to spawn
        if (Math.random() < .5)
            return;

        let healthObject = new HealthObject(object);
        Game.instance.interactObjects.push(healthObject);

        let action = new OnOffAction(200,
            function onActivate() {
            },
            function onDisactivate() {
                Game.instance.interactObjects = Game.instance.interactObjects.filter(ho => ho !== healthObject);
            }
        );
        action.activate();
        Game.instance.actionManager.onOffActions.push(action);
    }
}
