import Game from "../game.js";

export default class PauseScreen {
    constructor() {
    }

    update() {
    }

    draw() {
        Game.ctx.fillStyle = 'rgba(0, 0, 0, .7)';
        Game.ctx.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);


        Game.ctx.fillStyle = 'white';
        Game.ctx.fillRect(Game.WIDTH/2-20, Game.HEIGHT/2-18, 15, 36);
        Game.ctx.fillRect(Game.WIDTH/2+15+10-20, Game.HEIGHT/2-18, 15, 36);
    }
}