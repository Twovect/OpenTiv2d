// Launcher functions for the game
// Deals with the HTML UI

// SCREEN MANAGEMENT
/** Display one of three screens: "mainMenu", "loading", or "game" */
function displayScreen(screenName){
    document.getElementById("mainMenuScreen").style.display = "none";
    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById(screenName + "Screen").style.display = "block";
}

// MENU OPTIONS
document.getElementById("importDataButton").addEventListener("click", () => {
    // Get the file
    document.getElementById("saveFile").click();
});

document.getElementById("gameMode").onclick = function switchMode() {
    if (gameMode == "Singleplayer") {
        // Set to multiplayer
        gameMode = "Multiplayer";
        document.getElementById("multiplayer-disp").style.fontWeight = "bold";
        document.getElementById("multiplayer-disp").style.color = "var(--text)";
        document.getElementById("singleplayer-disp").style.fontWeight = "normal";
        document.getElementById("singleplayer-disp").style.color = "var(--textlight)";
        document.getElementById("singleplayer-settings").style.display = "none";
        document.getElementById("multiplayer-settings").style.display = "block";
    } else {
        // Set back to singleplayer
        gameMode = "Singleplayer";
        document.getElementById("singleplayer-disp").style.fontWeight = "bold";
        document.getElementById("singleplayer-disp").style.color = "var(--text)";
        document.getElementById("multiplayer-disp").style.fontWeight = "normal";
        document.getElementById("multiplayer-disp").style.color = "var(--textlight)";
        document.getElementById("singleplayer-settings").style.display = "block";
        document.getElementById("multiplayer-settings").style.display = "none";
    }
}

// TODO: make dependencies nicer here (include gamef earlier, maybe?)
// TODO: make loading save files actually work
document.getElementById("saveFile").addEventListener("change", () => {
    readSave();
});

function finishLoad(loadedTitle) {
    console.log("Loaded file: " + loadedTitle);
    document.getElementById("importedDataLister").innerHTML += "<span class=\"codetext\">" + loadedTitle + "</span>";
}

// GAME OPTIONS
function generateSeed() {
    let seed = Math.floor((Math.random() * 999999999) + 100000000);
    return seed;
}

const initialSeed = generateSeed();
const gameOptions = {
    worldWidth: DEFAULT_WORLDGEN_WIDTH,
    seed: initialSeed,
    playerColor: 0,
    worldgenMethod: 0,
    godMode: 0
};
const GAME_OPTION_LIMITS = {
    worldWidth: {
        min: MIN_ALLOWED_WORLDGEN_WIDTH,
        max: MAX_ALLOWED_WORLDGEN_WIDTH
    },
    seed: {
        min: 0
    },
    playerColor: {
        min: 0,
        max: PLAYER_COLORS.length - 1
    },
    worldgenMethod: {
        min: 0,
        max: 2
    },
    godMode: {
        min: 0,
        max: 1
    }
}

/** Try to set a game option, ensuring it is valid */
function trySetGameOption(optionKey, val) {
    // Ensure integer
    const parsed = parseInt(val);
    if (isNaN(parsed) || parsed == null) {
        return false;
    }
    val = parsed;
    // Specifics
    if ('min' in GAME_OPTION_LIMITS[optionKey]) {
        val = Math.max(val, GAME_OPTION_LIMITS[optionKey].min);
    }
    if ('max' in GAME_OPTION_LIMITS[optionKey]) {
        val = Math.min(val, GAME_OPTION_LIMITS[optionKey].max);
    }
    // Success
    gameOptions[optionKey] = val;
    return true;
}

function updateOptionKeyUI(optionKey) {
    const thisVal = gameOptions[optionKey];
    document.getElementById("in-" + optionKey).value = thisVal;
    if (optionKey == 'playerColor') {
        const colordisp = document.getElementById("colordisp");
        colordisp.style.backgroundColor = PLAYER_COLORS[thisVal];
    }
    if (optionKey == 'worldgenMethod') {
        const METHODS = ["Modern", "Diverse", "Legacy"]
        const wm = document.getElementById("worldgenMethodText");
        wm.innerText = METHODS[thisVal];
    }
}

function activateGameOptionsInputs() {
    for (const optionKey of Object.keys(gameOptions)) {
        // Fill in the default value
        updateOptionKeyUI(optionKey)

        // Set up listening to events
        const thisInput = document.getElementById("in-" + optionKey);
        const thisOptionKey = optionKey;
        thisInput.addEventListener("change", (e) => {
            trySetGameOption(thisOptionKey, e.target.value)
            // Set back to whatever the actual value is
            updateOptionKeyUI(thisOptionKey)
        });
    }
}
activateGameOptionsInputs();

// Handle the multiplayer server URL, which is separate
let multiplayerServerURL = "wss://server.tivect.com"; // "ws://localhost:5002"
const serverURLInput = document.getElementById("in-serverUrl");
serverURLInput.value = multiplayerServerURL;
serverURLInput.addEventListener("change", e => {
    multiplayerServerURL = e.target.value;
});

// Store if mobile
// This is determined by the "touchstart" and related events
let isMobile = false;

// Debugging
const debugCheck = document.getElementById("in-debugcheck");
debugCheck.addEventListener("click", (e) => {
    isMobile = debugCheck.checked;
});

// Launch the game with the start button
document.getElementById("start").addEventListener("click", async () => {
    // Legacy comment: "fix this it is partially working"
    // Show a loading screen
    document.getElementById("start").innerText = "Loading...";
    document.getElementById("start").disabled = true;
    displayScreen("loading");
    await (new Promise(res => setTimeout(res, 1)));
    if (gameMode == "Multiplayer" && !loadServerData.usingData) {
        // Set up and connect to multiplayer server
        await setUpWs(multiplayerServerURL);
        // TODO: FIX WHY????
        await (new Promise(res => setTimeout(res, 1)));
        loadServerData.usingData = true;
        ws.send(`joinrequest|${sid}`);
        load = setInterval(loadGame,100);
    }
    loadGame();
    // The game should have finished loading
    displayScreen("game");
    setTimeout(dataLoaded,5000);
});
