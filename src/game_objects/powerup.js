import ImageManager from "../engine/imageManager.js";
import SoundManager from "../engine/soundManager.js";
import { UpdatedAction, OnOffAction } from "../engine/action.js";
import { distance } from "../engine/collision.js";
import Game from "../game.js";
import { moveToward } from "../movingObject.js";
import SquareObject from "./squareObject.js";
import { Collider } from "../enums/enums.js";

export class Powerup extends SquareObject {
    static collider = Collider.RECTANGLE;

    // sum of chances must be 1
    static types = {
        'boots': {
            chance: 0.30,
            img_id: 'boots',
            // the position where the powerup will move to when taken
            statusPos: { x: 0, y: 0 },
            active: false
        },
        'potion': {
            chance: 0.30,
            img_id: 'potion',
            statusPos: { x: 0, y: 0 },
            active: false
        },
        'mask': {
            chance: 0.30,
            img_id: 'mask',
            statusPos: { x: 0, y: 0 },
            active: false
        },
        'life': {
            chance: 0.10,
            img_id: 'heart',
            statusPos: { x: 0, y: 0 },
            active: false
        }
    };

    constructor() {
        super();

        this.length = 20;
        this.left = Math.floor(Math.random() * (Game.WIDTH - this.length));
        this.top = Game.instance.status.barHeight + Math.floor(Math.random() * (Game.HEIGHT - this.length - Game.instance.status.barHeight));

        this.layTime = 300; // number of frames after which the powerup disappear from the ground
        this.appearTime = Game.gameFrames;
        this.speed = 10;

        let random = Math.random();
        let chanceSum = 0;

        // randomly pick the type of the powerup according to chance
        for (let [key, value] of Object.entries(Powerup.types)) {
            chanceSum += value.chance;
            if (random < chanceSum) {
                this.type = key;
                break;
            }
        }

        this.image = ImageManager.get(Powerup.types[this.type].img_id);
        this.shown = true;
    }

    interact() {
        Game.instance.powerups.array = Game.instance.powerups.array.filter(pu => pu !== this);
        
        let action = new UpdatedAction(500,
            function onActivate() {
                SoundManager.play('collect');
                this.obj.shown = true;
            },
            function onDisactivate() {
                Powerup.types[this.obj.type].func();
            },
            function update() {
                this.obj.speed *= 1.02;

                let newX = Powerup.types[this.obj.type].statusPos.x;
                let newY = Powerup.types[this.obj.type].statusPos.y;
        
                if (distance(this.obj.posX, this.obj.posY, newX, newY) < 20) {
                    this.disActivate();
                    return;
                }
        
                moveToward(this.obj, newX, newY, this.obj.speed);
            },
            function draw() {
                this.obj.draw();
            }, this
        );
        action.activate();
        Game.instance.actionManager.updatedActions.push(action);
    }

    update() {
        if (Game.gameFrames >= this.appearTime + this.layTime) {
            Game.instance.powerups.array = Game.instance.powerups.array.filter(powerup => powerup !== this);
        } else if ((this.appearTime + this.layTime) - Game.gameFrames < 75) {
            if (Game.gameFrames % 5 === 0) {
                this.shown = !this.shown;
            }
        }
    }

    draw() {
        if (this.shown) {
            Game.ctx.drawImage(this.image, this.left, this.top, this.length, this.length);
        }
    }
}

export default class Powerups {
    constructor() {
        this.array = []; // array of Powerup objects

        // boots func
        Powerup.types['boots'].func = () => {
            Powerup.types['boots'].action.activate();
        };

        // boots action
        Powerup.types['boots'].action = new OnOffAction(400,
            function onActivate() {
                Game.instance.player.speed = 10;
                Game.instance.player.powerups.boots = true;
            },
            function onDisactivate() {
                Game.instance.player.speed = 6;
                Game.instance.player.powerups.boots = false;
            }
        );
        Game.instance.actionManager.onOffActions.push(Powerup.types['boots'].action);

        // potion func
        Powerup.types['potion'].func = () => {
            Powerup.types['potion'].action.activate();
        };

        // potion action
        Powerup.types['potion'].action = new OnOffAction(400,
            function onActivate() {
                Game.instance.player.strength = 15;
                Game.instance.player.powerups.potion = true;
            },
            function onDisactivate() {
                Game.instance.player.strength = 5;
                Game.instance.player.powerups.potion = false;
            }
        );
        Game.instance.actionManager.onOffActions.push(Powerup.types['potion'].action);


        // mask func
        Powerup.types['mask'].func = () => {
            Powerup.types['mask'].action.activate();
        };

        // mask action
        Powerup.types['mask'].action = new OnOffAction(400,
            function onActivate() {
                Game.instance.player.powerups.mask = true;
            },
            function onDisactivate() {
                Game.instance.player.powerups.mask = false;
            }
        );
        Game.instance.actionManager.onOffActions.push(Powerup.types['mask'].action);

        
        
        // life func
        Powerup.types['life'].func = () => {
            Game.instance.player.lives++;
        };
    }

    reset() {
        this.array = [];
    }

    setActive(type, active) {
        if (active) {
            Powerup.types[type].action.activate();
        } else {
            Powerup.types[type].action.disActivate();
        }
    }

    disactivateAll() {
        Object.values(Powerup.types).forEach(type => {
            if (type.action !== undefined) {
                type.action.disActivate()
            }
        })
    }

    update() {
        this.array.forEach(powerup => powerup.update());
    }

    draw() {
        this.array.forEach(powerup => powerup.draw());
    }
}
