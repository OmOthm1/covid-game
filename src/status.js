import SoundManager from "./engine/soundManager.js";
import Game from "./game.js";
import InputHandler from "./engine/input.js";
import SquareObject from "./game_objects/squareObject.js";
import { Powerup } from "./game_objects/powerup.js";
import { TextAlign, TextBaseLine } from "./enums/enums.js";

export default class Status {
    /**@type {Game} */
    game;

    constructor() {
        this.game = Game.instance;

        this.positions = {
            lives: { x: 10, y: 10 },
            kills: { x: 150, y: 10 },
            boots: { x: 350, y: 10 },
            potion: { x: 400, y: 10 },
            volume: { x: Game.WIDTH - 50, y: 10 }
        }
        this.iconWidth = 36;
        this.barHeight = this.iconWidth + 10 * 2;

        Powerup.types['boots'].statusPos.x = this.positions.boots.x + this.iconWidth / 2;
        Powerup.types['boots'].statusPos.y = this.positions.boots.y + this.iconWidth / 2;
        Powerup.types['potion'].statusPos.x = this.positions.potion.x + this.iconWidth / 2;
        Powerup.types['potion'].statusPos.y = this.positions.potion.y + this.iconWidth / 2;
        Powerup.types['life'].statusPos.x = this.positions.lives.x + this.iconWidth / 2;
        Powerup.types['life'].statusPos.y = this.positions.lives.y + this.iconWidth / 2;

        // set mouse event for sound icon
        this.soundIcon = new SquareObject();
        this.soundIcon.isRendered = function () {
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
        const game = this.game;
        const highOpacity = 0.7;
        const lowOpacity = 0.3;

        const textStyle = {
            fontSize: 32,
            textAlign: TextAlign.LEFT,
            textBaseline: TextBaseLine.MIDDLE,
            opacity: highOpacity
        };

        game.ctxHelper.addRect(0, 0, Game.WIDTH, this.barHeight, { color: 'white', opacity: highOpacity });

        // let w = Game.ctx.measureText(Game.instance.player.lives).width;
        game.ctxHelper.addImage('heart', this.positions.lives.x, this.positions.lives.y, this.iconWidth, this.iconWidth, { opacity: highOpacity });
        game.ctxHelper.addText(this.game.player.lives, (this.positions.lives.x) + this.iconWidth + 15, 10 + this.iconWidth / 2 + 3, textStyle);

        // boots image
        const bootsOpacity = game.player.powerups.boots ? highOpacity : lowOpacity;
        game.ctxHelper.addImage('boots', this.positions.boots.x, this.positions.boots.y, this.iconWidth, this.iconWidth, { opacity: bootsOpacity });

        // potoin image
        const potionOpacity = game.player.powerups.potion ? highOpacity : lowOpacity;
        game.ctxHelper.addImage('potion', this.positions.potion.x, this.positions.potion.y, this.iconWidth, this.iconWidth, { opacity: potionOpacity });

        // kills
        game.ctxHelper.addImage('virus1', this.positions.kills.x, this.positions.kills.y, this.iconWidth, this.iconWidth, { opacity: highOpacity });
        game.ctxHelper.addText(game.player.kills, this.positions.kills.x + this.iconWidth + 15, 10 + this.iconWidth / 2 + 3, textStyle);

        game.ctxHelper.addText(`×${game.player.multiply}`, 20, Game.HEIGHT - 20, {
            fontSize: 72,
            textAlign: TextAlign.LEFT,
            textBaseline: TextBaseLine.BOTTOM
        });

        Game.ctx.globalAlpha = 1.0;
    }

    drawSoundIcon() {
        let image = SoundManager.isPlaying('music') ? 'speaker' : 'muted';
        this.game.ctxHelper.addImage(image, this.positions.volume.x, this.positions.volume.y, this.iconWidth, this.iconWidth);
        this.soundIcon.lastRenderFrame = Game.frames;
    }
}