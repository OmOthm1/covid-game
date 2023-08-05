import AboutScreen from "./aboutScreen.js";
import HelpScreen from "./helpScreen.js";
import MenuScreen from "./menuScreen.js";

/*
the menu state is devided into screens
each screen is a class and must have the following instance attribute\s: { buttonList }
*/

export default class Menu {
    constructor() {
        this.screens = {
            'main': new MenuScreen(this),
            'about': new AboutScreen(this),
            'help': new HelpScreen(this)
        };
        this.activeScreen = 'main';
    }

    get screen() {
        return this.screens[this.activeScreen];
    }

    get renderedButtonList() {
        return this.screen.buttonList;
    }

    update() {
        this.screen.update();
    }

    draw() {
        this.screen.draw();
    }
}
