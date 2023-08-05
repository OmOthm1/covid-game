import SoundManager from "../engine/soundManager.js";
import RectangleObject from "../game_objects/rectangleObject.js";
import InputHandler from "../engine/input.js";
import Game from "../game.js";
import { FONT } from "../engine/preferences.js";
import { TextAlign, TextBaseLine } from "../enums/enums.js";

export class ButtonList {
    constructor() {
        this.buttons = [];
        this._focusedIdx = 0;
    }

    add(button) {
        button.idx = this.buttons.length;
        button.buttonList = this;
        if (button.idx === 0) {
            button.focused = true;
        }
        this.buttons.push(button);
    }

    set focusedIdx(newIdx) {
        if (newIdx === this.focusedIdx) {
            return;
        }
        SoundManager.play('rollover');
        this.buttons[this.focusedIdx].focused = false;
        this.buttons[newIdx].focused = true;
        this._focusedIdx = newIdx;
    }

    get focusedIdx() {
        return this._focusedIdx;
    }

    focusNext() {
        this.focusedIdx = (this.focusedIdx + 1) % this.buttons.length;
    }

    focusPrev() {
        if (this.focusedIdx === 0) {
            this.focusedIdx = this.buttons.length - 1;
        } else {
            this.focusedIdx--;
        }
    }

    clickFocused() {
        this.buttons[this.focusedIdx].action();
    }

    getButton(index) {
        return this.buttons[index];
    }

    get length() {
        return this.buttons.length;
    }

    draw() {
        this.buttons.forEach(button => button.draw());
    }
}

export class Button extends RectangleObject {
    static count = 0;

    constructor(text, action) {
        super();

        this.style = {
            unfocused: {
                'width': 300,
                'height': 60,
                'bgColor': '#000',
                'textColor': '#fff',
                'fontSize': 28,
                'font': FONT
            },
            focused: {
                'bgColor': '#9db85f',
                'textColor': '#000'
            }
        };

        this.text = text;
        this.action = action;
        this.focused = false;

        Game.ctx.font = `${this.getRule('fontSize')}px ${this.getRule('font')}`;
        let w = Game.ctx.measureText(this.text).width + 60;
        this.style.focused.width = w;
        this.style.unfocused.width = w;

        this.id = Button.count;
        Button.count++;

        InputHandler.addClickListenter(`button${this.id}`, this, () => { this.clickListener() });
        InputHandler.clickListenerSetActive(`button${this.id}`, true);
    }

    get currentStyle() {
        if (this.focused) {
            return this.style.focused;
        } else {
            return this.style.unfocused;
        }
    }

    set focused(bool) {
        this._focused = bool;
        this.width = this.getRule('width');
        this.height = this.getRule('height');
    }

    get focused() {
        return this._focused;
    }

    getRule(rule) {
        if (this.currentStyle[rule] !== undefined) {
            return this.currentStyle[rule];
        } else {
            return this.style.unfocused[rule];
        }
    }

    draw() {
        // BG
        Game.instance.ctxHelper.addRect(this.left, this.top, this.width, this.height, { color: this.getRule('bgColor') });

        // text
        Game.instance.ctxHelper.addText(this.text, this.posX, this.posY, {
            fontSize: this.getRule('fontSize'),
            color: this.getRule('textColor'),
            textAlign: TextAlign.CENTER,
            textBaseline: TextBaseLine.MIDDLE
        });

        this.lastRenderFrame = Game.frames;
    }

    isRendered() {
        return Game.frames - this.lastRenderFrame < 2;
    }

    clickListener() {
        if (this.focused) {
            this.action();
        } else {
            this.buttonList.focusedIdx = this.idx;
        }
    }
}
