class Controls {
  constructor() {
    this.pressed = {}
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
      "c": "cruise", // 13
      "l": "save1", // 14
      "o": "save2" // 15
    }
    this.clickLocations = []
  }

  /** Return whether key is down */
  isDown(actionName) {
    return (actionName in Object.keys(this.pressed)) && (this.pressed[actionName] == true);
  }

  /** Return whether key is down, and if so, also unpress it */
  isDownNoHold(actionName) {
    if (actionName in Object.keys(this.pressed)) {
      delete this.pressed[actionName];
    }
  }

  /** Press a key */
  pressKey(rawKey) {
    console.log("Pressing: " + rawKey);
    const mapped = this.keybindings[rawKey.toLowerCase()];
    if (!mapped) {
      // Not found in mappings, so not added
      return;
    }
    this.pressed[mapped] = true;
  }
  
  /** Release a key */
  releaseKey(rawKey) {
    console.log("Releasing: " + rawKey);
    const mapped = this.keybindings[rawKey.toLowerCase()];
    if (!mapped) {
      // Not found in mappings, so not added
      return;
    }
    delete this.pressed[mapped];
  }
}
