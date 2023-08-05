import { DrawType, TextAlign, TextBaseLine } from "../enums/enums.js";
import ImageManager from "./imageManager.js";
import { FONT } from "./preferences.js";

export class CtxHelper {
    static defaults = {
        color: 'black',
        fontFamily: FONT,
        fontSize: 12,
        textAlign: TextAlign.START,
        textBaseline: TextBaseLine.ALPHABETIC,
        opacity: 1
    };

    /** @type {CanvasRenderingContext2D} */
    ctx;

    constructor(ctx) {
        this.ctx = ctx;
    }

    /**
     * @param {string} text Text to fill.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @param {string} [fontFamily] Font family.
     * @param {number} [fontSize] Font size in pixels.
     * @param {string} [color] Text color.
     * @param {string} [textAlign] Text align.
     * @param {string} [textBaseline] Text base line.
     * @param {number} [opacity] Text Opacity.
     */
    addText(text, x, y, {
        fontFamily = CtxHelper.defaults.fontFamily,
        fontSize = CtxHelper.defaults.fontSize,
        color = CtxHelper.defaults.color,
        textAlign = CtxHelper.defaults.textAlign,
        textBaseline = CtxHelper.defaults.textBaseline,
        opacity = CtxHelper.defaults.opacity
    } = {}) {
        this.ctx.globalAlpha = opacity;
        this.ctx.font = `${fontSize}px ${fontFamily}`;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = textAlign;
        this.ctx.textBaseline = textBaseline;
        this.ctx.fillText(text, x, y);
    }

    addRect(x, y, width, height, {
        color = CtxHelper.defaults.color,
        opacity = CtxHelper.defaults.opacity,
    } = {}) {
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    addImage(imgKey, x, y, width, height, { opacity = CtxHelper.defaults.opacity } = {}) {
        this.ctx.globalAlpha = opacity;
        this.ctx.drawImage(ImageManager.get(imgKey), x, y, width, height);
    }

    addCircle(x, y, radius, {
        drawType = DrawType.FILL,
        color = CtxHelper.defaults.color,
        opacity = CtxHelper.defaults.opacity,
        strokeColor = CtxHelper.defaults.color
    } = {}) {
        this.ctx.globalAlpha = opacity;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = strokeColor;

        if (drawType === DrawType.FILL) {
            this.ctx.fill();
        } else if (drawType === DrawType.STROKE) {
            this.ctx.stroke();
        } else if (drawType === DrawType.FILL_AND_STROKE) {
            this.ctx.fill();
            this.ctx.stroke();
        } else {
            throw new Error("Invalid draw type: " + drawType);
        }
    }
}