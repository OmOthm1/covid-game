export default class GameObject {
    constructor() {
        this._posX = 0;
        this._posY = 0;
    }

    set posX(newX) {
        this._posX = Math.round(newX);
    }

    set posY(newY) {
        this._posY = Math.round(newY);
    }

    get posX() {
        return this._posX;
    }

    get posY() {
        return this._posY;
    }
}
