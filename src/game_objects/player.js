import ImageManager from "../engine/imageManager.js";
import SoundManager from "../engine/soundManager.js";
import areColliding, { RectRectColliding, distance } from "../engine/collision.js";
import Game, { gameState } from "../game.js";
import HealthBar from "./healthBar.js";
import SquareObject from "./squareObject.js";
import InputHandler from "../engine/input.js";
import { moveToward } from "../movingObject.js";
import { OnOffAction } from "../engine/action.js";

// this class is used for any square or circle shaped object
export default class Player extends SquareObject {
    static collider = 'rectangle';

    constructor() {
        super();

        this.posX = 550;
        this.posY = 450;
        this.destination = {
            x: this.posX,
            y: this.posY
        }
        
        this.length = 35;

        this.maxVelocity = {
            x: 10,
            y: 10
        };
        this.velocity = {
            x: 10,
            y: 10
        };

        // how fast can the player move
        this.speed = 6;

        // number of lives the player have (if less than 0 => game over)
        this.lives = 2;

        // the amount of health the player have (if less or equal to 0 => player loses one life)
        this._health = 100;

        // the maximum health the player can have (full health)
        this.maxHealth = 100;

        // the number of points the player gathered by killing viruses
        this.kills = 0;

        // the damage the player deals per frame when viruses under attack
        this.strength = 5;

        // the index of the current sprite of the player
        this.imgIdx = 0;

        // when true => the player doesn't get damaged
        this.unDamagable = false;

        // the kill count is going to be multiplied with this number
        this.multiply = 1;

        this.unDamagableAction = new OnOffAction(150,
            () => { this.unDamagable = true },
            () => { this.unDamagable = false; this.shown = true }
        );
        Game.instance.actionManager.onOffActions.push(this.unDamagableAction);

        // when false => the player won't render
        this.shown = true;

        // determines wheather the powerup is active or not
        this.powerups = {
            boots: false,
            potion: false,
            mask: false
        };

        // determines the direction of player movement
        this.movingTo = {
            top: false,
            right: false,
            bottom: false,
            left: false,
        }

        // caches the last moving direction
        this.lastMovingTo = { ...this.movingTo };
        
        // inisialize a HealthBar object associated with player
        this.healthBar = new HealthBar(this);

        // inisialize a FireCircle object associated with player
        this.fireCircle = new FireCircle(this);

        this.recentKills = [];
        this.recentKillMeasure = 1;
        this.lastKillTime = 0;
    }

    addToRecentKills(value) {
        this.recentKillMeasure += value;
        value *= this.multiply;
        
        this.lastKillTime = Game.gameFrames;
        
        this.recentKills.push({ value, time: Game.gameFrames });
        let counter = 0;
        this.recentKills = this.recentKills.filter(kill => {
            let valid = Game.gameFrames - kill.time < 1000;
            if (valid)
                counter += kill.value;
            return valid;
        });

        if (counter > 100) {
            this.recentKills = [];
            return true;
        } else {
            return false;
        }
    }

    increaseKills(value) {
        this.kills += value;
        Game.instance.levelInstance.killsChanged();
    }

    set health(newHealth) {
        // don't decrement health if unDamagable
        if ((this.unDamagable || this.powerups.mask) && newHealth < this.health) {
            return;
        }

        if (newHealth <= 0) {
            this.die();
            return;
        }

        if (newHealth <= this.maxHealth) {
            this._health = newHealth;
        } else {
            this._health = this.maxHealth;
        }
    }

    get health() {
        return this._health;
    }

    die() {
        this.lives--;
        if (this.lives < 0) {
            if (this.kills > Game.bestScore) {
                Game.bestScore = this.kills;
            }
            Game.instance.gameState = gameState.GAMEOVER;
        } else {
            this.health = this.maxHealth; // restore full health
            Game.instance.powerups.disactivateAll(); // disactivate all active powerups
            this.unDamagableAction.activate(); // start the undamagable action
        }
    }

    // called on the begining of a game
    reset() {
        this.fireCircle.storingEnergy = false;
        this.fireCircle.firing = false;
        this.health = this.maxHealth;
        this.lives = 2;
        this.kills = 0;
        this.recentKillMeasure = 1;
    }

    // decrements the health by a value
    takeHit(value) {
        this.health -= value;
        this.gettingDamaged = true;
    }

    // determines whether the player position has changed the current update
    isMoving() {
        return this.movingTo.left || this.movingTo.right || this.movingTo.top || this.movingTo.bottom;
    }

    updateMovingDirection() {
        if (this.posX > this.destination.x) {
            this.movingTo.left = true;
            this.movingTo.right = false;
        } else if (this.posX < this.destination.x) {
            this.movingTo.right = true;
            this.movingTo.left = false;
        } else {
            this.movingTo.left = false;
            this.movingTo.right = false;
        }

        if (this.posY > this.destination.y) {
            this.movingTo.top = true;
            this.movingTo.bottom = false;
        } else if (this.posY < this.destination.y) {
            this.movingTo.bottom = true;
            this.movingTo.top = false;
        } else {
            this.movingTo.top = false;
            this.movingTo.bottom = false;
        }
    }

    // converts the movingTo object to one string represeting the moving direction
    movingDirection() {
        let direction = '';
        if (this.movingTo.top) {
            direction = 'top';
        } else if (this.movingTo.bottom) {
            direction = 'bottom'
        }
        if (this.movingTo.left) {
            if (!direction) {
                direction = 'left'
            } else {
                direction += '-left'
            }
        } else if (this.movingTo.right) {
            if (!direction) {
                direction = 'right'
            } else {
                direction += '-right'
            }
        }
        if (!direction) {
            direction = 'none';
        }
        return direction;
    }

    setDestination(pos) {
        this.destination = pos;
    }

    update() {
        this.healing = false;
        // resets the gettingDamaged variable to false
        this.gettingDamaged = false;

        // collide with enemies
        Game.instance.enemies.forEach(enemy => {
            if (areColliding(enemy, this)) {
                enemy.interact();
            }
        });

        // collide with powerups
        Game.instance.powerups.array.forEach(powerup => {
            if (areColliding(this, powerup)) {
                powerup.interact();
            }
        });
        
        // collide with interactable objects (e.g. door)
        Game.instance.interactObjects.forEach(obj => {
            if (areColliding(this, obj)) {
                obj.interact();
            }
        });

        if (!Game.instance.settings.alwaysFollowCursor) {
            if (!InputHandler.keyDown.mouse) {
                // handle keyboard input
                if (InputHandler.key.left) {
                    this.destination.x = this.posX - this.maxVelocity.x;
                } else if (InputHandler.key.right) {
                    this.destination.x = this.posX + this.maxVelocity.x;
                } else {
                    this.destination.x = this.posX;
                }
        
                if (InputHandler.key.up) {
                    this.destination.y = this.posY - this.maxVelocity.y;
                } else if (InputHandler.key.bottom) {
                    this.destination.y = this.posY + this.maxVelocity.y;
                } else {
                    this.destination.y = this.posY;
                }
        
                if (this.movingTo.left || this.movingTo.right) {
                    this.lastMovingTo = { ...this.movingTo };
                }
            }
        }

        if (distance(this.posX, this.posY, this.destination.x, this.destination.y) < 3) {
            this.posX = this.destination.x;
            this.posY = this.destination.y;
        }

        this.updateMovingDirection();

        if (this.isMoving()) {
            // storing the positing of player in the last frame
            let old = {
                posX: this.posX,
                posY: this.posY,
                top: this.top,
                right: this.right,
                bottom: this.bottom,
                left: this.left,
            }

            moveToward(this, this.destination.x, this.destination.y, this.speed);

            // collide with hard objects (e.g. mom)
            Game.instance.hardObjects.forEach(obj => {
                if (RectRectColliding(this, obj)) {

                    switch (this.movingDirection()) {
                        case 'right':
                            this.right = obj.left - 1;
                            break;
                        case 'left':
                            this.left = obj.right + 1;
                            break;
                        case 'top':
                            this.top = obj.bottom + 1;
                            break;
                        case 'bottom':
                            this.bottom = obj.top - 1;
                            break;
                        case 'top-left':
                            if (old.top < obj.bottom && old.left > obj.right) {
                                this.left = obj.right + 1;
                            } else {
                                this.top = obj.bottom + 1;
                            }
                            break;
                        case 'top-right':
                            if (old.top < obj.bottom && old.right < obj.left) {
                                this.right = obj.left - 1;
                            } else {
                                this.top = obj.bottom + 1;
                            }
                            break;
                        case 'bottom-left':
                            if (old.left > obj.right && old.bottom > obj.top) {
                                this.left = obj.right + 1;
                            } else {
                                this.bottom = obj.top - 1;
                            }
                            break;
                        case 'bottom-right':
                            if (old.right < obj.left && old.bottom > obj.top) {
                                this.right = obj.left - 1;
                            } else {
                                this.bottom = obj.top - 1;
                            }
                            break;
                    }
                }
            });

            // collide with level edges
            if (this.right > Game.instance.levelInstance.edge.right) {
                this.right = Game.instance.levelInstance.edge.right;
            } else if (this.left < Game.instance.levelInstance.edge.left) {
                this.left = Game.instance.levelInstance.edge.left;
            }

            if (this.top < Game.instance.levelInstance.edge.top) {
                this.top = Game.instance.levelInstance.edge.top;
            } else if (this.bottom > Game.instance.levelInstance.edge.bottom) {
                this.bottom = Game.instance.levelInstance.edge.bottom;
            }
        }

        if (this.unDamagable) {
            if (Game.frames % 3 === 0) {
                this.shown = !this.shown;
            }
        }

        let minDeltaTime = Math.min(1000 / (this.recentKillMeasure+1), 150);
        if (Game.gameFrames - this.lastKillTime > minDeltaTime) {
            this.recentKillMeasure = Math.pow(this.recentKillMeasure, 0.9993);
        }
        this.multiply = Math.floor((this.recentKillMeasure / 10) + 1);

        this.fireCircle.update();
    }

    draw() {
        // fire
        this.fireCircle.draw();

        // player
        // if (this.isMoving()) {
            if (Game.frames % 20 === 0) { // change every 20 frame
                this.imgIdx = (this.imgIdx + 1) % 2;
            }
        // }

        let drawTo;
        if (this.movingTo.left || this.movingTo.right) {
            drawTo = this.movingTo;
        } else {
            drawTo = this.lastMovingTo;
        }
        
        if (!this.shown)
            return;

        if (drawTo.left) {
            if (this.powerups.mask) {
                Game.ctx.drawImage(ImageManager.get('player_L_mask'), this.left, this.top, this.length, this.length);
            } else {
                Game.ctx.drawImage(ImageManager.get(`player_L_${this.imgIdx+1}`), this.left, this.top, this.length, this.length);
            }
            
        } else if (drawTo.right) {
            if (this.powerups.mask) {
                Game.ctx.drawImage(ImageManager.get('player_R_mask'), this.left, this.top, this.length, this.length);
            } else {
                Game.ctx.drawImage(ImageManager.get(`player_R_${this.imgIdx+1}`), this.left, this.top, this.length, this.length);
            }
        } else {
            if (this.powerups.mask) {
                Game.ctx.drawImage(ImageManager.get('player_L_mask'), this.left, this.top, this.length, this.length);
            } else {
                Game.ctx.drawImage(ImageManager.get(`player_L_${this.imgIdx+1}`), this.left, this.top, this.length, this.length);
            }
        }

        // do not draw the health bar at level 0
        if (!this.unDamagable) {
            this.healthBar.draw();
        }
    }
}

class FireCircle extends SquareObject {
    static collider = 'circle';

    constructor(obj) {
        super();

        this.obj = obj; // the object that the circle is attached to
        this.minRadius = 90; // the minimum radius of the circle
        this.maxRadius = 200; // the maximum radius of the circle
        this.growVelocity = 7; // the increment value to the circle radius per frame
        this.radius = 1; // the current radius of the circle
        this.firing = false; // are we firing? (draw & update calls are aborted if false)
        this.timeUntilFull = 100; // number of frames space key has to be down until maximum energy reached
    }

    // called one time when player presses space key
    spaceDownStarted() {
        this.storingEnergy = true;
        this.spaceDownStartFrame = Game.gameFrames;
    }

    // called when player releses space key
    // sets the storedEnergy to a number between 0 and 1 depending on space key down time
    // and then calls fire()
    spaceDownEnded() {
        this.storedEnergy = this.currentStoredEnergy();
        this.storingEnergy = false;
        this.fire();
    }

    currentStoredEnergy() {
        if (!this.storingEnergy) {
            return 0;
        } else {
            return Math.min((Game.gameFrames - this.spaceDownStartFrame) / this.timeUntilFull, 1);
        }
    }

    fire() {
        SoundManager.play('foom');
        this.firing = true;
    }

    // converts the storedEnergy to the radius of the current hit
    energyToRadius() {
        return Math.max(this.storedEnergy * this.maxRadius, this.minRadius);
    }

    update() {
        if (!this.firing) {
            return;
        }

        // increasing the radius by growVelocity each frame
        this.radius += this.growVelocity;

        // stop firing and reset radius if we reached the radius of the current hit
        if (this.radius >= this.energyToRadius()) {
            this.radius = 1;
            this.firing = false;
        }

        // checks for collision between the Circle and each enemy.
        Game.instance.enemies.forEach(enemy => {
            if (areColliding(this, enemy)) {
                enemy.takeHit(this.obj.strength);
            }
        });
    }

    draw() {
        if (this.storingEnergy) {
            Game.ctx.beginPath();
            Game.ctx.arc(this.obj.posX, this.obj.posY, (this.obj.radius+10)*this.currentStoredEnergy(), 0, 2 * Math.PI);
            if (Game.instance.player.powerups.potion) {
                Game.ctx.fillStyle = 'rgba(95, 255, 65, .4)';
                Game.ctx.strokeStyle = 'rgba(95, 255, 65, 1.0)';
            } else {
                Game.ctx.fillStyle = 'rgba(65, 95, 255, .4)';
                Game.ctx.strokeStyle = 'rgba(65, 95, 255, 1.0)';
            }
            Game.ctx.fill();
            Game.ctx.stroke();
        }

        if (!this.firing) {
            return;
        }

        Game.ctx.beginPath();
        Game.ctx.arc(this.obj.posX, this.obj.posY, this.radius, 0, 2 * Math.PI);
        if (Game.instance.player.powerups.potion) {
            Game.ctx.fillStyle = 'rgba(95, 255, 65, .2)';
        } else {
            Game.ctx.fillStyle = 'rgba(65, 95, 255, .2)';
        }
        Game.ctx.fill();
    }

    get posX() {
        return this.obj.posX;
    }

    get posY() {
        return this.obj.posY;
    }
}

