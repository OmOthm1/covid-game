import Game from '../game.js';
import SoundManager from './soundManager.js';
import { GameState } from '../enums/enums.js';

export default class InputHandler {
    static keyDown = {};
    static keyUpListeners = {};
    static keyDownListeners = {};
    static clickListeners = {};

    static addClickListenter(id, _object, _listener) {
        InputHandler.clickListeners[id] = {
            object: _object,
            listener: _listener,
            active: false
        }
    };

    static clickListenerSetActive(id, active) {
        InputHandler.clickListeners[id].active = active;
    };

    constructor() {
        document.addEventListener('keydown', (event) => {
            const listener = InputHandler.keyDownListeners[event.code];

            if (listener) {
                listener(event);
            }

            InputHandler.keyDown[event.code] = true;
        });

        document.addEventListener('keyup', (event) => {
            const listener = InputHandler.keyUpListeners[event.code];

            if (listener) {
                listener(event);
            }

            InputHandler.keyDown[event.code] = false;
        });

        Game.ctx.canvas.addEventListener('click', function (evt) {
            let cursor = InputHandler.cursorPos(evt);

            Object.values(InputHandler.clickListeners).forEach(cListener => {
                if (!cListener.active || !cListener.object.isRendered()) {
                    return;
                }

                if (
                    cursor.x > cListener.object.left &&
                    cursor.x < cListener.object.right &&
                    cursor.y > cListener.object.top &&
                    cursor.y < cListener.object.bottom
                ) {
                    cListener.listener();
                }
            });
        });

        const mouseupAction = (evt) => {
            switch (Game.instance.gameState) {
                case GameState.RUNNING:
                    Game.instance.player.fireCircle.spaceDownEnded();
                    if (InputHandler.keyDown['Space']) {
                        Game.instance.player.fireCircle.spaceDownStarted();
                    }
                    break;
            }
        };


        Game.ctx.canvas.addEventListener('mousedown', function (evt) {
            Game.instance.player.setDestination(InputHandler.cursorPos(evt));
            InputHandler.keyDown.mouse = true;

            switch (Game.instance.gameState) {
                case GameState.RUNNING:
                    if (!InputHandler.keyDown['Space']) {
                        Game.instance.player.fireCircle.spaceDownStarted();
                    }
                    break;
            }
        });

        Game.ctx.canvas.addEventListener('mouseup', function (evt) {
            InputHandler.keyDown.mouse = false;
            mouseupAction();
        });

        Game.ctx.canvas.addEventListener('mousemove', function (evt) {
            if (Game.instance.settings.alwaysFollowCursor) {
                Game.instance.player.setDestination(InputHandler.cursorPos(evt));
            } else {
                if (InputHandler.keyDown.mouse) {
                    Game.instance.player.setDestination(InputHandler.cursorPos(evt));
                }
            }
        });

        Game.ctx.canvas.addEventListener('touchmove', function (evt) {
            evt.preventDefault();
            Game.instance.player.setDestination(InputHandler.touchPos(evt));
        });

        Game.ctx.canvas.addEventListener('touchstart', function (evt) {
            // evt.preventDefault();

            InputHandler.keyDown.mouse = true;

            switch (Game.instance.gameState) {
                case GameState.RUNNING:
                    if (evt.touches.length === 1) {
                        Game.instance.player.fireCircle.spaceDownStarted();
                    }
                    break;
            }

            Game.instance.player.setDestination(InputHandler.touchPos(evt));
        });

        Game.ctx.canvas.addEventListener('touchend', function (evt) {
            // evt.preventDefault();
            if (evt.touches.length === 0) {
                InputHandler.keyDown.mouse = false;
            }

            switch (Game.instance.gameState) {
                case GameState.RUNNING:
                    Game.instance.player.fireCircle.spaceDownEnded();

                    if (evt.touches.length > 0) {
                        Game.instance.player.fireCircle.spaceDownStarted();
                    }
                    break;
            }


            // mouseupAction();
        });
    }

    static cursorPos(evt) {
        // abs. size of canvas
        let rect = Game.ctx.canvas.getBoundingClientRect();

        // relationship bitmap vs. canvas for X
        let scaleX = Game.ctx.canvas.width / rect.width;

        // relationship bitmap vs. element for Y
        let scaleY = Game.ctx.canvas.height / rect.height;

        // scale mouse coordinates after they have been adjusted to be relative to canvas
        let cursor = {
            x: Math.round((evt.clientX - rect.left) * scaleX),
            y: Math.round((evt.clientY - rect.top) * scaleY)
        };

        return cursor;
    }

    static touchPos(evt) {
        // abs. size of canvas
        let rect = Game.ctx.canvas.getBoundingClientRect();

        // relationship bitmap vs. canvas for X
        let scaleX = Game.ctx.canvas.width / rect.width;

        // relationship bitmap vs. element for Y
        let scaleY = Game.ctx.canvas.height / rect.height;

        // scale touch coordinates after they have been adjusted to be relative to canvas
        let cursor = {
            x: (evt.touches[0].clientX - rect.left) * scaleX,
            y: (evt.touches[0].clientY - rect.top) * scaleY
        };

        return cursor;
    }
}
