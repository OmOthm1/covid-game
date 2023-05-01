import GameObject from "./gameObject.js";

export default class SquareObject extends GameObject {
    constructor() {
        super();

        this._radius = 0;

        this.edge = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    }

    updateEdges() {
        this.edge.top = this.posY - this.radius;
        this.edge.right = this.posX + this.radius;
        this.edge.bottom = this.posY + this.radius;
        this.edge.left = this.posX - this.radius;
    }

    set radius(newRadius) {
        this._radius = Math.round(newRadius);
        this.updateEdges();
    }

    get radius() {
        return this._radius;
    }

    set posX(newX) {
        this._posX = Math.round(newX);
        this.updateEdges();
    }

    get posX() {
        return this._posX;
    }

    set posY(newY) {
        this._posY = Math.round(newY);
        this.updateEdges();
    }

    get posY() {
        return this._posY;
    }

    set length(newLength) {
        this.radius = newLength/2;
    }

    get length() {
        return this._radius*2;
    }

    set height(newHeight) {
        this.length = newHeight;
    }

    get height() {
        return this._radius*2;
    }

    set width(newWidth) {
        this.length = newWidth;
    }

    get width() {
        return this._radius*2;
    }

    set top(newTop) {
        this.posY = newTop + this.radius;
    }

    get top() {
        return this.edge.top;
    }

    set bottom(newBottom) {
        this.posY = newBottom - this.radius;
    }

    get bottom() {
        return this.edge.bottom;
    }

    set right(newRight) {
        this.posX = newRight - this.radius;
    }

    get right() {
        return this.edge.right;
    }

    set left(newLeft) {
        this.posX = newLeft + this.radius;
    }

    get left() {
        return this.edge.left;
    }
}