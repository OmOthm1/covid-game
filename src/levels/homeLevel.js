import { FONT } from "../engine/preferences.js";
import ImageManager from "../engine/imageManager.js";
import RectangleObject from "../game_objects/rectangleObject.js";
import Game from "../game.js";
import SquareObject from "../game_objects/squareObject.js";
import { Collider } from "../enums/enums.js";

export default class HomeLevel {
    constructor() {
        this.width = 392;
        this.height = 297;
        this.position = {
            x: Game.WIDTH/2 - this.width/2,
            y: Game.HEIGHT/2 - this.height/2
        };
        this.mom = new Mom();
        this.door = new Door();

        this.edge = {
            top: this.position.y + 40,
            right: this.position.x + this.width - 8,
            bottom: this.position.y + this.height - 8,
            left: this.position.x + 8,
        };

        const texts = [
            "حبيبي ودي الزبالة عالحاوية",
            "يبني نط جيبلنا بنص ليرة خبز",
            "جرة الغاز خلصت.. طير جيبلنا جرة خليني أعرف أعمل فنجان قهوة",
            "يما الله يرضى عليك جيبلي كيلو خيار",
            "يما ركاض عالسوق جيبلنا جميد للمنسف",
            "الدار ما فيها ولا حبة خبز، أركض جيبلنا بدينار يما",
            "الله يرضى عليك يما تجيبلنا علبة لبن قبل ما تنزل المقلوبة"
        ];

        this.dialog = new TalkDialog({x: this.mom.posX, y: this.mom.posY - 30}, texts[Math.floor(Math.random()*texts.length)]);

        this.hardObjects = [this.mom];
        this.interactObjects = [this.door];
    }

    reset() {
        // reset player positon
        Game.instance.player.posX = 550;
        Game.instance.player.posY = 450;
    }

    update() {
        this.mom.update();
    }

    draw() {
        Game.ctx.fillStyle = 'black';
        Game.ctx.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);
        Game.ctx.drawImage(ImageManager.get('house'), this.position.x, this.position.y, 392, 297);
        this.mom.draw();
        this.dialog.draw();
    }
}

class Mom extends SquareObject {
    constructor() {
        super();

        this.posX = Game.WIDTH/2 - 392/2 + 75;
        this.posY = Game.HEIGHT/2 - 297/2 + 150;
        this.width = 50;
        this.height = 50;
    }

    update() {
    }

    draw() {
        Game.ctx.drawImage(ImageManager.get('mom'), this.left, this.top, this.length, this.length);
    }
}

class TalkDialog {
    constructor(position, text) {
        this.text = text;
        this.position = position;
        this.padding = 10;
    }

    update() {
    }

    draw() {
        Game.ctx.font = `14px ${FONT}`;
        let w = Game.ctx.measureText(this.text).width;

        Game.ctx.fillStyle = "lightgrey";
        Game.ctx.fillRect(this.position.x, this.position.y - this.padding * 2, w + 20, 40)

        Game.ctx.fillStyle = 'black';
        Game.ctx.textAlign = 'left';
        Game.ctx.fillText(this.text, this.position.x + this.padding, this.position.y);
    }
}

class Door extends RectangleObject {
    static collider = Collider.RECTANGLE;

    constructor() {
        super();

        this.posX = 604;
        this.posY = 593;
        this.width = 72;
        this.height = 15;
    }

    interact() {
        Game.instance.moveToNextLevel();
    }

    update() {
    }

    draw() {
        Game.ctx.fillStyle = "black";
        Game.ctx.fillRect(this.left, this.top, this.width, this.height);
    }
}
