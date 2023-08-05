import { Button, ButtonList } from "../button.js";
import Game from "../../game.js";

export default class AboutScreen {
    constructor(menu) {
        this.backButton = new Button(
            'عودة',
            () => { menu.activeScreen = 'main' }
        );
        this.backButton.style.focused['bgColor'] = 'black';
        this.backButton.style.focused['textColor'] = 'white';
        this.backButton.style.focused['width'] = 150;
        
        this.buttonList = new ButtonList();
        this.buttonList.add(this.backButton);
        
        this.backButton.bottom = Game.HEIGHT-30;
        this.backButton.left = 30;
    }

    update() {

    }

    draw() {
        Game.ctx.fillStyle = 'white';
        Game.ctx.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);
        this.buttonList.draw();
    }
}