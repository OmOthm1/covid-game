import Game from "../game.js";

export class OnOffAction {
    constructor(time, onActivate, onDisactivate, obj) {
        this.active = false;
        this.time = time;
        this.onActivate = onActivate;
        this.onDisactivate = onDisactivate;
        this.obj = obj;
    }

    activate() {
        this.active = true;
        this.start = Game.gameFrames;
        this.onActivate();
    }

    disActivate() {
        this.active = false;
        this.onDisactivate();
    }
}

export class UpdatedAction {
    constructor(time, onActivate, onDisactivate, update, draw, obj) {
        this.active = false;
        this.time = time;
        this.onActivate = onActivate;
        this.onDisactivate = onDisactivate;
        this.update = update;
        this.draw = draw;
        this.obj = obj;
    }

    activate() {
        this.active = true;
        this.start = Game.gameFrames;
        this.onActivate();
    }

    disActivate() {
        this.active = false;
        this.onDisactivate();
    }
}

export default class ActionManager {
    constructor() {
        this.updatedActions = [];
        this.onOffActions = [];
        this.staticUpdatedActions = [];
    }

    clearAll() {
        this.updatedActions = [];
        this.onOffActions.forEach(action => { action.disActivate() });
        this.staticUpdatedActions.forEach(action => { action.active = false });
    }

    update() {
        // update active status for all actions
        [...this.staticUpdatedActions, ...this.onOffActions, ...this.updatedActions].forEach(
            action => {
                if (action.active) {
                    if (Game.gameFrames >= action.start + action.time) {
                        action.disActivate();
                    }
                }
            }
        );

        // remove unactive updatedActions
        this.updatedActions = this.updatedActions.filter(action => action.active);

        // update active updatedActions & staticUpdatedActions
        [...this.updatedActions, ...this.staticUpdatedActions].forEach(action => {
            if (action.active) {
                action.update();
            }
        });
    }

    draw() {
        [...this.updatedActions, ...this.staticUpdatedActions].forEach(action => {
            if (action.active) {
                action.draw();
            }
        });
    }
}