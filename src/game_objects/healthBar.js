import Game from "../game.js";

export default class HealthBar {
    constructor(gameObject) {
        this.gameObject = gameObject;
        this.width = 50;
        this.hegiht = 6;
        this.padding = 2;
        this.fgColor = 'green';
        this.bgColor = 'white';
    }

    draw() {
        let healthRatio = this.gameObject.health / this.gameObject.maxHealth;

        Game.ctx.fillStyle = this.bgColor;
        Game.ctx.fillRect(
            this.gameObject.posX - this.width/2,
            this.gameObject.top - 15,
            this.width,
            this.hegiht
        )

        Game.ctx.fillStyle = this.fgColor;
        Game.ctx.fillRect(
            this.gameObject.posX - this.width/2 + this.padding,
            this.gameObject.top - (15-this.padding),
            (this.width-this.padding*2) * healthRatio,
            this.hegiht - this.padding * 2
        );

    }
}