import Game from "../game.js";

class Action {
    /**@type {boolean} */
    active;

    /**
     * Duration for action completion (in frames).
     * @type {number}
     */
    time;

    /**
     * Called when the action is activated.
     * @type {callback}
     */
    onActivate;

    /**
     * Called when the action is disactivated (time is done).
     * @type {callback}
     */
    onDisactivate;

    /**
     * Object to do the action on.
     */
    obj;

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

export class OnOffAction extends Action {
    constructor(time, onActivate, onDisactivate, obj) {
        super(time, onActivate, onDisactivate, obj);
    }
}

export class UpdatedAction extends Action {
    constructor(time, onActivate, onDisactivate, update, draw, obj) {
        super(time, onActivate, onDisactivate, obj);
        this.update = update;
        this.draw = draw;
    }
}

export default class ActionManager {
    constructor() {
        this.updatedActions = [];
        this.onOffActions = [];
        this.staticUpdatedActions = [];

        this.actions = [];
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