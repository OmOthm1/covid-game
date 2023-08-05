import { FONT } from "../engine/preferences.js";
import Game from "../game.js";
import { Button, ButtonList } from "./button.js";
import { GameState, TextAlign } from "../enums/enums.js";

export default class GameOver {
    constructor() {
        this.randomX = 0;
        this.randomy = 0;

        this.menuButton = new Button(
            'إلى القائمة',
            () => { Game.instance.gameState = GameState.MENU }
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
        const ctxHelper = Game.instance.ctxHelper;

        ctxHelper.addRect(0, 0, Game.WIDTH, Game.HEIGHT);

        ctxHelper.addText('انتهت اللعبة', Game.WIDTH / 2 + this.randomX, Game.HEIGHT / 2 + this.randomY, {
            fontSize: 48,
            color: 'white',
            textAlign: TextAlign.CENTER,
        });

        ctxHelper.addText(`نقاطك: ${Game.instance.player.kills} / الأفضل: ${Game.bestScore}`, Game.WIDTH / 2, Game.HEIGHT / 2 + 70, {
            fontSize: 28,
            color: 'white',
            textAlign: TextAlign.CENTER,
        });

        this.buttonList.draw();
    }
}