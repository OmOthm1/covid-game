import { FONT } from "../engine/preferences.js";
import Game, { gameState } from "../game.js";
import { Button, ButtonList } from "./button.js";

export default class GameOver {
    constructor() {
        this.randomX = 0;
        this.randomy = 0;

        this.menuButton = new Button(
            'إلى القائمة',
            () => { Game.instance.gameState = gameState.MENU }
        );
        // this.backButton.style.focused.bgColor = 'black';
        // this.backButton.style.focused.textColor = 'white';
        // this.backButton.style.focused.width = 150;
        
        this.buttonList = new ButtonList();
        this.buttonList.add(this.menuButton);
        
        this.menuButton.posX = Game.WIDTH/2;
        this.menuButton.bottom = Game.HEIGHT-30;
    }

    update() {
        if (Game.frames % 5 == 0) {
            this.randomX = Math.floor(Math.random() * 14 - 7);
            this.randomY = Math.floor(Math.random() * 14 - 7);
        }
    }

    draw() {
        Game.ctx.fillStyle = 'black';
        Game.ctx.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);

        Game.ctx.font = `48px ${FONT}`;
        Game.ctx.fillStyle = 'white';
        Game.ctx.textAlign = 'center';
        Game.ctx.fillText('انتهت اللعبة', Game.WIDTH / 2 + this.randomX, Game.HEIGHT / 2 + this.randomY);
        Game.ctx.font = `28px ${FONT}`;
        Game.ctx.fillText(`نقاطك: ${Game.instance.player.kills} / الأفضل: ${Game.bestScore}`, Game.WIDTH / 2, Game.HEIGHT / 2 + 70);
        // Game.ctx.fillText(`الأفضل: ${Game.bestScore}`, Game.WIDTH / 2, Game.HEIGHT / 2 + 110);

        this.buttonList.draw();
    }
}