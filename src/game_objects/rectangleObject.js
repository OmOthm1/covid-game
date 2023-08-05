import GameObject from "./gameObject.js";

export default class RectangleObject extends GameObject {
    constructor() {
        super();

        this._width = 0;
        this._height = 0;

        this.edge = {
            top: 0,
            right: 0,
            left: 0,
            bottom: 0
        };
    }

    updateLeftRightEdges() {
        this.edge.right = this.posX + this.width/2;
        this.edge.left = this.posX - this.width/2;
    }
    
    updateTopBottomEdges() {
        this.edge.top = this.posY - this.height/2;
        this.edge.bottom = this.posY + this.height/2;
    }

    set width(newWidth) {
        this._width = Math.round(newWidth);
        this.updateLeftRightEdges();
    }

    get width() {
        return this._width;
    }

    set height(newHeight) {
        this._height = Math.round(newHeight);
        this.updateTopBottomEdges();
    }

    get height() {
        return this._height;
    }

    set posX(newX) {
        this._posX = Math.round(newX);
        this.updateLeftRightEdges();
    }

    get posX() {
        return this._posX;
    }

    set posY(newY) {
        this._posY = Math.round(newY);
        this.updateTopBottomEdges();
    }

    get posY() {
        return this._posY;
    }

    set top(newTop) {
        this.posY = newTop + this.height/2;
    }

    get top() {
        return this.edge.top;
    }

    set bottom(newBottom) {
        this.posY = newBottom - this.height/2;
    }

    get bottom() {
        return this.edge.bottom;
    }

    set right(newRight) {
        this.posX = newRight - this.width/2;
    }

    get right() {
        return this.edge.right;
    }

    set left(newLeft) {
        this.posX = newLeft + this.width/2;
    }

    get left() {
        return this.edge.left;
    }

}