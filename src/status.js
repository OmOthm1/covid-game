import ImageManager from "./engine/imageManager.js";
import SoundManager from "./engine/soundManager.js";
import { FONT } from "./engine/preferences.js";
import Game from "./game.js";
import InputHandler from "./engine/input.js";
import SquareObject from "./game_objects/squareObject.js";
import { Powerup } from "./game_objects/powerup.js";

export default class Status {
    constructor() {
        this.positions = {
            lives: {x: 10, y: 10},
            kills: {x: 150, y: 10},
            boots: {x: 350, y: 10},
            potion: {x: 400, y: 10},
            volume: {x: Game.WIDTH-50, y: 10}
        }
        this.iconWidth = 36;
        this.barHeight = this.iconWidth + 10*2;

        Powerup.types['boots'].statusPos.x = this.positions.boots.x + this.iconWidth/2;
        Powerup.types['boots'].statusPos.y = this.positions.boots.y + this.iconWidth/2;
        Powerup.types['potion'].statusPos.x = this.positions.potion.x + this.iconWidth/2;
        Powerup.types['potion'].statusPos.y = this.positions.potion.y + this.iconWidth/2;
        Powerup.types['life'].statusPos.x = this.positions.lives.x + this.iconWidth/2;
        Powerup.types['life'].statusPos.y = this.positions.lives.y + this.iconWidth/2;
        
        // set mouse event for sound icon
        this.soundIcon = new SquareObject();
        this.soundIcon.isRendered = function() {
            if (!this.lastRenderFrame) {
                return false;
            }
            return Game.frames - this.lastRenderFrame < 2;
        };
        this.soundIcon.length = this.iconWidth;
        this.soundIcon.left = this.positions.volume.x;
        this.soundIcon.top = this.positions.volume.y;
        InputHandler.addClickListenter('soundIcon', this.soundIcon, () => { SoundManager.toggle('music') });
        InputHandler.clickListenerSetActive('soundIcon', true);
    }

    update() {
    }

    draw() {
        Game.ctx.globalAlpha = 0.5;
        Game.ctx.fillStyle = 'white';
        Game.ctx.fillRect(0, 0, Game.WIDTH, this.barHeight);
        
        /*
        let path = new Path2D(`
            M 0 ${this.barHeight}
            H 450
            C 470 ${this.barHeight-10}, 470 10 , 470 0
            H 0 0
            Z
        `);
        Game.ctx.fill(path);
        */
        
        Game.ctx.globalAlpha = 0.7;
        // lives
        Game.ctx.font = `32px ${FONT}`;
        Game.ctx.fillStyle = 'black';
        Game.ctx.textAlign = 'left';
        Game.ctx.textBaseline = 'middle';
        
        // let w = Game.ctx.measureText(Game.instance.player.lives).width;
        Game.ctx.drawImage(ImageManager.get('heart'), this.positions.lives.x, this.positions.lives.y, this.iconWidth, this.iconWidth);
        Game.ctx.fillText(Game.instance.player.lives, (this.positions.lives.x) + this.iconWidth+15, 10 + this.iconWidth/2 + 3);

        if (Game.instance.player.powerups.boots) {
            Game.ctx.globalAlpha = 0.7;
        } else {
            Game.ctx.globalAlpha = 0.3;
        }
        Game.ctx.drawImage(ImageManager.get('boots'), this.positions.boots.x, this.positions.boots.y, this.iconWidth, this.iconWidth);

        if (Game.instance.player.powerups.potion) {
            Game.ctx.globalAlpha = 0.7;
        } else {
            Game.ctx.globalAlpha = 0.3;
        }
        Game.ctx.drawImage(ImageManager.get('potion'), this.positions.potion.x, this.positions.potion.y, this.iconWidth, this.iconWidth);

        Game.ctx.globalAlpha = 0.7;
        // kills
        Game.ctx.drawImage(ImageManager.get('virus1'), this.positions.kills.x, this.positions.kills.y, this.iconWidth, this.iconWidth);
        Game.ctx.fillText(Game.instance.player.kills, this.positions.kills.x + this.iconWidth+15, 10 + this.iconWidth/2 + 3);

        Game.ctx.font = `72px ${FONT}`;
        Game.ctx.fillStyle = 'black';
        Game.ctx.textAlign = 'left';
        Game.ctx.textBaseline = 'bottom';
        Game.ctx.fillText(`×${Game.instance.player.multiply}`, 20, Game.HEIGHT - 20);

        Game.ctx.globalAlpha = 1.0;
    }
    
    drawSoundIcon() {
        if (SoundManager.isPlaying('music')) {
            Game.ctx.drawImage(ImageManager.get('speaker'), this.positions.volume.x, this.positions.volume.y, this.iconWidth, this.iconWidth);
        } else {
            Game.ctx.drawImage(ImageManager.get('muted'), this.positions.volume.x, this.positions.volume.y, this.iconWidth, this.iconWidth);
        }
        this.soundIcon.lastRenderFrame = Game.frames;        
    }
}