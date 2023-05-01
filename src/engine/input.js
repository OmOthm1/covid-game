import Game, { gameState } from '../game.js';
import SoundManager from './soundManager.js';

export default class InputHandler {
    static key = {
        left: false,
        up: false,
        right: false,
        bottom: false
    };

    static keyDown = {
        space: false,
        mouse: false
    };

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

    constructor () {
        this.spaceDownStart = 0;

        document.addEventListener('keydown', (event) => {
            switch (event.keyCode) {
                case 32:
                    var spaceWasDown = InputHandler.keyDown.space;
                    InputHandler.keyDown.space = true;
                    break;
            }

            switch(Game.instance.gameState) {
                case gameState.RUNNING:
                    switch (event.keyCode) {
                        case 37: // left arrow
                            InputHandler.key.left = true;
                            break;
                        case 38: // up arrow
                            InputHandler.key.up = true;
                            break;
                        case 39: // right arrow
                            InputHandler.key.right = true;
                            break;
                        case 40: // bottom arrow
                            InputHandler.key.bottom = true;
                            break;
                        case 32: // space
                            if (!spaceWasDown && !InputHandler.keyDown.mouse) {
                                Game.instance.player.fireCircle.spaceDownStarted();
                            }
                            break;
                    }
            }
        });

        document.addEventListener('keyup', (event) => {
            switch (event.keyCode) {
                case 37: // left arrow
                    InputHandler.key.left = false;
                    break;
                case 38: // up arrow
                    InputHandler.key.up = false;
                    break;
                case 39: // right arrow
                    InputHandler.key.right = false;
                    break;
                case 40: // bottom arrow
                    InputHandler.key.bottom = false;
                    break;
                case 77:
                    SoundManager.toggle('music');
                    break;
                case 32:
                    InputHandler.keyDown.space = false;
                    break;
            }

            switch(Game.instance.gameState) {
                case gameState.RUNNING:
                    switch (event.keyCode) {
                        case 32: // space
                            Game.instance.player.fireCircle.spaceDownEnded();
                            if (InputHandler.keyDown.mouse) {
                                Game.instance.player.fireCircle.spaceDownStarted();
                            }
                            break;
                        case 80: // p
                            Game.instance.gameState = gameState.PAUSED;
                            break;
                    }
                    break;

                case gameState.MENU:
                    switch (event.keyCode) {
                        case 38: // up arrow
                            Game.instance.menu.renderedButtonList.focusPrev();
                            break;
                        
                        case 40: // bottom arrow
                            Game.instance.menu.renderedButtonList.focusNext();
                            break

                        case 32: // space
                            Game.instance.menu.renderedButtonList.clickFocused();
                            break;
                    }
                    break;
                
                case gameState.GAMEOVER:
                    switch (event.keyCode) {
                        case 32: // space
                            Game.instance.gameOver.buttonList.clickFocused();
                            break;
                    }
                    break;
                
                case gameState.PAUSED: {
                    switch (event.keyCode) {
                        case 80: // p
                            Game.instance.gameState = gameState.RUNNING;
                            break;
                    }
                }
                break;
            }
        });

        Game.ctx.canvas.addEventListener('click', function(evt) {
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
            switch(Game.instance.gameState) {
                case gameState.RUNNING:
                    Game.instance.player.fireCircle.spaceDownEnded();
                    if (InputHandler.keyDown.space) {
                        Game.instance.player.fireCircle.spaceDownStarted();
                    }
                    break;
            }
        };


        Game.ctx.canvas.addEventListener('mousedown', function(evt) {
            Game.instance.player.setDestination(InputHandler.cursorPos(evt));
            InputHandler.keyDown.mouse = true;
    
            switch(Game.instance.gameState) {
                case gameState.RUNNING:
                    if (!InputHandler.keyDown.space) {
                        Game.instance.player.fireCircle.spaceDownStarted();
                    }
                    break;
            }
        });

        Game.ctx.canvas.addEventListener('mouseup', function(evt) {
            InputHandler.keyDown.mouse = false;
            mouseupAction();
        });

        Game.ctx.canvas.addEventListener('mousemove', function(evt) {
            if (Game.instance.settings.alwaysFollowCursor) {
                Game.instance.player.setDestination(InputHandler.cursorPos(evt));
            } else {
                if (InputHandler.keyDown.mouse) {
                    Game.instance.player.setDestination(InputHandler.cursorPos(evt));
                }
            }
        });

        Game.ctx.canvas.addEventListener('touchmove', function(evt) {
            evt.preventDefault();
            Game.instance.player.setDestination(InputHandler.touchPos(evt));
        });

        Game.ctx.canvas.addEventListener('touchstart', function(evt) {
            // evt.preventDefault();

            InputHandler.keyDown.mouse = true;
    
            switch(Game.instance.gameState) {
                case gameState.RUNNING:
                    if (evt.touches.length === 1) {
                        Game.instance.player.fireCircle.spaceDownStarted();
                    }
                    break;
            }

            Game.instance.player.setDestination(InputHandler.touchPos(evt));
        });

        Game.ctx.canvas.addEventListener('touchend', function(evt) {
            // evt.preventDefault();
            if (evt.touches.length === 0) {
                InputHandler.keyDown.mouse = false;
            }

            switch(Game.instance.gameState) {
                case gameState.RUNNING:
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
