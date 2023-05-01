import Game from "../../game.js";
import { Button, ButtonList } from "../button.js";
import ImageManager from "../../engine/imageManager.js";
import SquareObject from "../../game_objects/squareObject.js";
import InputHandler from "../../engine/input.js";

export default class MenuScreen {
    constructor(menu) {
        this.buttonList = new ButtonList();

        this.buttonsInfo = [
            {
                text: "ابدأ",
                action: () => { Game.instance.start() }
            },
            {
                text: "تعليمات",
                action: () => { menu.activeScreen = 'help' }
            }
        ];

        const margin = 5;

        for (let i = 0; i < this.buttonsInfo.length; i++) {
            const buttonInfo = this.buttonsInfo[i];
            const button = new Button(buttonInfo.text, buttonInfo.action);
            button.posX = Game.WIDTH/2;
            button.posY = 600 + (button.height + margin) * i;
            button.style.unfocused.width = 300;
            button.style.focused.width = 300;
            this.buttonList.add(button);
        }

        this.randomX = 0;
        this.randomy = 0;

        // my logo
        this.mylogo = new SquareObject();
        this.mylogo.isRendered = function() {
            if (!this.lastRenderFrame) {
                return false;
            }
            return Game.frames - this.lastRenderFrame < 2;
        };
        this.mylogo.length = 52;
        this.mylogo.right = Game.WIDTH-15;
        this.mylogo.bottom = Game.HEIGHT-15;
        InputHandler.addClickListenter('mylogo', this.mylogo, () => { window.open('https://www.facebook.com/Omar.Othman.D', '_blank'); });
        InputHandler.clickListenerSetActive('mylogo', true);

    }

    update() {
        if (Game.frames % 6 == 0) {
            this.randomX = Math.floor(Math.random() * 14 - 7);
            this.randomY = Math.floor(Math.random() * 14 - 7);
        }
    }

    draw() {
        Game.ctx.fillStyle = 'white';
        Game.ctx.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);

        Game.ctx.drawImage(ImageManager.get('concrete'), 0, 0);
        
        let topOfButtons = this.buttonList.getButton(0).top;
        let bottomOfButtons = this.buttonList.getButton(this.buttonList.length-1).bottom;
        let leftOfButtons = this.buttonList.getButton(0).left;
        let rightOfButtons = this.buttonList.getButton(0).right;
        let heightOfButtons = bottomOfButtons - topOfButtons;
        let widthOfButtons = rightOfButtons - leftOfButtons;

        Game.ctx.fillStyle = 'white';
        Game.ctx.fillRect(leftOfButtons-20, topOfButtons-20, widthOfButtons+40, heightOfButtons+40)

        Game.ctx.fillStyle = 'black';
        Game.ctx.fillRect(leftOfButtons-10, topOfButtons-10, widthOfButtons+20, heightOfButtons+20);

        Game.ctx.globalAlpha = 0.2;
        Game.ctx.drawImage(
            ImageManager.get('logo'),
            Game.WIDTH/2 - ImageManager.get('logo').width/1.5/2 + 50 + this.randomX*-2,
            100 + this.randomY*-2,
            ImageManager.get('logo').width/1.5,
            ImageManager.get('logo').height/1.5
        );
        Game.ctx.globalAlpha = 1.0;

        Game.ctx.drawImage(
            ImageManager.get('logo'),
            Game.WIDTH/2 - ImageManager.get('logo').width/1.5/2 + 50 + this.randomX,
            100 + this.randomY,
            ImageManager.get('logo').width/1.5,
            ImageManager.get('logo').height/1.5
        );

        this.drawMyLogo();

        this.buttonList.draw();   
    }

    drawMyLogo() {
        Game.ctx.fillStyle = 'white';
        Game.ctx.fillRect(this.mylogo.left, this.mylogo.top, this.mylogo.length, this.mylogo.length);
        Game.ctx.drawImage(ImageManager.get('mylogo'), this.mylogo.left+5, this.mylogo.top+5, this.mylogo.length-10, this.mylogo.length-10);
        this.mylogo.lastRenderFrame = Game.frames;
    }
}
