class ControlsManager {
  constructor() {
    this.pressed = {};
    // TODO: refactor into a constant, perhaps allow configurability
    this.keybindings = {
      " ": "jump", // 0
      "a": "move_left", // 1
      "d": "move_right", // 2
      "w": "sprint", // 3
      "s": "slow", // 4
      "f": "drop", // 5
      ".": "respawn", // 6
      "`": "menu", // 7
      "1": "inv_1", // 8
      "2": "inv_2", // 9
      "3": "inv_3", // 10
      "4": "inv_4", // 11
      "5": "inv_5", // 12
      "m": "unknown", // 13
      "l": "save1", // 14
      "o": "save2", // 15
      "c": "cruise", // 16
    };
    this.clickX = -1;
    this.clickY = -1;
    this.mousePressed = false;
    this.touches = {};
  }

  /** Return whether the key corresponding to a specific action is down */
  isDown(actionName) {
    return actionName in this.pressed;
  }

  /** Return whether the key corresponding to a specific action is down, and if so, also unpress it */
  isDownNoHold(actionName) {
    if (actionName in this.pressed) {
      delete this.pressed[actionName];
      return true;
    }
    return false;
  }

  /** Press a key */
  pressKey(rawKey) {
    const mapped = this.keybindings[rawKey.toLowerCase()];
    if (!mapped) {
      return;
    }
    this.pressed[mapped] = true;
  }
  
  /** Release a key */
  releaseKey(rawKey) {
    const mapped = this.keybindings[rawKey.toLowerCase()];
    if (!mapped) {
      return;
    }
    delete this.pressed[mapped];
  }

  /** Press the key corresponding to a specific action */
  pressAction(actionName) {
    this.pressed[actionName] = true;
  }

  /** Release the key corresponding to a specific action */
  releaseAction(actionName) {
    delete this.pressed[actionName];
  }

  /** Return whether the mouse is down */
  isMouseDown() {
    return this.mousePressed;
  }

  /** Return the x element of the last click position */
  lastClickPositionX() {
    return this.clickX;
  }

  /** Return the y element of the last click position */
  lastClickPositionY() {
    return this.clickY;
  }

  /** Mouse down */
  pressMouse() {
    this.mousePressed = true;
  }

  /** Mouse up, clearing all click locations */
  releaseMouse() {
    this.mousePressed = false;
  }

  /** Update mouse location */
  updateMouseLocation(x, y) {
    this.clickX = x;
    this.clickY = y;
  }

  /** Add or update a touch at a location with an identifier */
  setTouch(x, y, identifier) {
    this.touches[identifier] = [x, y];
  }

  /** Remove a touch with an identifier */
  removeTouch(identifier) {
    delete this.touches[identifier];
  }

  /** Get whether a rectangle is being touched */
  isTouchingRectangle(x, y, width, height) {
    for (const touch of Object.values(this.touches)) {
      if (touch[0] >= x && touch[0] < x + width && touch[1] >= y && touch[1] < y + height) {
        return true;
      }
    }
    return false;
  }
}
