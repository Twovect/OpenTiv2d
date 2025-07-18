/** Return the generated map, containing only mountains */
function modernWorldgen(options) {
    const heights = [];
    for(let i = 0; i < options.worldWidth; i++){
        let newHeight = Math.floor(TivectWorldgenFunctions.mountains(i/10.0, options.seed)*DEFAULT_WORLDGEN_VERTICAL_SCALE);
        heights.push(newHeight)
    }
    return processHeightMap(heights);
}

/** Return the generated map, using diverse biomes */
function diverseWorldgen(options) {
    const heights = [];
    const biomes = generateBiomes(options);
    for (let i = 0; i < options.worldWidth; i++){
        let newHeight = 1;
        if (biomes[i] == 0) {
            newHeight = Math.floor(TivectWorldgenFunctions.mountains(i/10.0, options.seed)*DEFAULT_WORLDGEN_VERTICAL_SCALE);
        } else if (biomes[i] == 1) {
            newHeight = Math.floor(TivectWorldgenFunctions.mountains(i/10.0, options.seed)*DEFAULT_WORLDGEN_VERTICAL_SCALE);
        } else {
            newHeight = Math.floor(TivectWorldgenFunctions.mountains(i/10.0, options.seed)*DEFAULT_WORLDGEN_VERTICAL_SCALE);
        }
        /*const TRANSITION_LEN = 10;
        for (let j = 0; j < TRANSITION_LEN; j++) {
            if (i > j && biomes[i - j - 1] != biomes[i]) {
                newHeight = Math.floor((heights[i - 1] * (TRANSITION_LEN - j) + newHeight * j) / (1.0 * TRANSITION_LEN));
                previousBiome = biomes[i];
            }
        }*/
        newHeight += 3;
        heights.push(newHeight)
    }
    return processHeightMapDiverse(heights, options.seed);
}

/** Return an array of what biome each x coordinate should be */
function generateBiomes(options) {
    const res = [];
    for (let i = 0; i < options.worldWidth; i++) {
        res.push(Math.floor(i / 40.0) % 3);
    }
    return res;
}

/// Tivect worldgen functions: calculates the y position with a given x position and seed (R: 0.1.2, E: 2023/6/4)
class TivectWorldgenFunctions {
    /// Better Pow: power that works with negative power
    static betterPow(a, b) {
        return Math.pow(Math.abs(a), b) * (
            (a < 0) ? -1 : 1
        );
    }

    /// Mountains generation
    static mountains(x, seed) {
        // Create result variable
        let res = 0.0;
        // Add term 1
        res += 3.5;
        // Add term 2
        let term2tosum = 0.0;
        for (let n = 1; n <= 20; n++) {
            let thisval = (
                1.0/4.0 * Math.sin(
                    this.betterPow(Math.E, n/10.0) * (
                        x/5.0 + 60.0 + seed + this.betterPow(n, Math.cos(x)/20.0)
                    )
                ) + 1.0/5.0 * Math.sin(
                    this.betterPow(Math.E, (n+3.0)/10.0) * (
                        x/10.0 + 60.0 + seed
                    )
                )
            );
            term2tosum += thisval;
        }
        let term2 = (
            4.0 * Math.atan(
                3.0/4.0 * (
                    this.betterPow(term2tosum, 15.0/13.0)
                )
            )
        );
        res += term2;
        // Add term 3
        let term3tosum = 0.0;
        for (let n = 1; n <= 20; n++) {
            let thisval = (
                1.0/4.0 * Math.sin(
                    this.betterPow(Math.E, n/10.0) * (
                        x/5.0 + 60.0 + 3 * seed + this.betterPow(n, Math.cos(x)/20.0)
                    )
                ) + 1.0/5.0 * Math.sin(
                    this.betterPow(Math.E, (n+3.0)/10.0) * (
                        x/2.0 + 60.0 + 2.0 * seed
                    )
                )
            );
            term3tosum += thisval;
        }
        let term3 = (
            4.0/5.0 * Math.atan(
                3.0/4.0 * (
                    this.betterPow(term3tosum, 15.0/13.0)
                )
            )
        )
        res += term3;
        // Return result
        return res;
    }

    /// Plateau generation
    static plateau(x, seed) {
        // Simply caps the mountain generated value at a maximum of 4
        return Math.min(this.mountains(x, seed), 4);
    }

    /// Ocean floor generation
    static oceanFloor(x, seed) {
        // Create result variable
        let mansion = 0.0;
        // Add term 1
        mansion += (-40.0);
        // Add term 2
        let rem = 0.0;
        for (let ram = 1; ram <= 8; ram++) {
            let emilia = Math.sin(
                this.betterPow(Math.E, ram/10.0) * x / 20.0
                + this.betterPow(ram, Math.cos(x)/4.0) / Math.log(ram + 4.0)
                + seed
                - Math.sin(1.0/ram * x)
            );
            rem += emilia;
        }
        let roswaal = (
            2 * Math.atan(1.0/8.0 * rem)
        );
        mansion += roswaal;
        // Return result
        return mansion;
    }
}

/** Fill in the given height map and return the result */
function processHeightMap(hMap) {
    let res = [];
    let width = hMap.length;
    let height = DEFAULT_WORLDGEN_HEIGHT;
    for (let i = 0; i < height; i++) {
        let newrow = [];
        for (let j = 0; j < width; j++) {
            newrow.push(undefined);
        }
        res.push(newrow);
    }
    for (let i = 0; i < width; i++) {
        let grassLevel = height - (hMap[i] + height / 2)
        let nearWaterLevel = grassLevel >= DEFAULT_WATER_LEVEL - 2;
        for (let j = 0; j < height; j++) {
            if (j < grassLevel && j < DEFAULT_WATER_LEVEL) {
                // Air
                setBlock(res, i, j, 0);
            }
            else if (j < grassLevel && j >= DEFAULT_WATER_LEVEL) {
                // Water
                setBlock(res, i, j, 13);
            }
            else if (j == grassLevel) {
                // Grass level
                if (nearWaterLevel) {
                    setBlock(res, i, j, 20);
                } else {
                    setBlock(res, i, j, 1);
                }
            }
            else if (j > grassLevel && j < grassLevel + 5) {
                // Dirt/sand level
                if (nearWaterLevel && j < grassLevel + 2) {
                    setBlock(res, i, j, 20);
                } else {
                    setBlock(res, i, j, 4);
                }
            }
            else if (j >= grassLevel + 5) {
                // Stone level
                setBlock(res, i, j, 5);
            }
        }
    }
    return res;
}

/** Fill in the given height map in a diverse style, and return the result */
function processHeightMapDiverse(hMap, seed) {
    let gen = new pseudoRand(seed);
    let res = [];
    let width = hMap.length;
    let height = DEFAULT_WORLDGEN_HEIGHT;
    for (let i = 0; i < height; i++) {
        let newrow = [];
        for (let j = 0; j < width; j++) {
            newrow.push(undefined);
        }
        res.push(newrow);
    }
    for (let i = 0; i < width; i++) {
        let grassLevel = height - (hMap[i] + height / 2)
        let nearWaterLevel = grassLevel >= DEFAULT_WATER_LEVEL - 2;
        for (let j = 0; j < height; j++) {
            if (j < grassLevel && j < DEFAULT_WATER_LEVEL) {
                // Air
                setBlock(res, i, j, 0);
            }
            else if (j < grassLevel && j >= DEFAULT_WATER_LEVEL) {
                // Water
                setBlock(res, i, j, 13);
            }
            else if (j == grassLevel) {
                // Grass level
                if (nearWaterLevel) {
                    setBlock(res, i, j, 20);
                } else {
                    setBlock(res, i, j, 1);
                }
            }
            else if (j > grassLevel && j < grassLevel + 5) {
                // Dirt/sand level
                if (nearWaterLevel && j < grassLevel + 2) {
                    setBlock(res, i, j, 20);
                } else {
                    setBlock(res, i, j, 4);
                }
            }
            else if (j >= grassLevel + 5) {
                // Stone level
                setBlock(res, i, j, 5);
            }
        }
    }
    // Trees and other structures
    const TREE_CHANCE = 0.02
    const HOME_CHANCE = 0.02
    const HOME_COOLDOWN_VAL = 10;
    let homeCooldown = 0;
    for (let x = 2; x < width - 2; x++) {
        let grassLevel = height - (hMap[x] + height / 2);
        if (gen.next() < TREE_CHANCE && grassLevel < DEFAULT_WATER_LEVEL) {
            // Create a tree here
            const treeHeight = Math.floor(gen.next() * 4 + 3);
            for (let k = 0; k < treeHeight; k++) {
                setBlock(res, x, grassLevel - 1 - k, 9); // 39?
            }
            // TODO: move to constants or another file?
            const STRUCTURE_TREETOP = [
                [-1, 29, 29, 29, -1],
                [29, 29, 29, 29, 29],
                [29, 29, 29, 29, 29],
            ];
            spawnStructure(res, x - 2, grassLevel - 1 - treeHeight - 2, STRUCTURE_TREETOP);
        }
        if (gen.next() < HOME_CHANCE && grassLevel < DEFAULT_WATER_LEVEL - 2 && homeCooldown <= 0) {
            const STRUCTURE_HOME = [
                [-1,15,15,15,15,15,15,-1],
                [15,2,2,2,2,2,2,15],
                [-1,2,9,10,10,10,2,-1],
                [-1,9,9,10,10,10,9,-1],
                [-1,9,9,9,9,9,9,-1],
                [-1,16,16,16,16,16,16,-1],
                [-1,4,4,4,4,4,4,-1],
                [-1,4,4,4,4,4,4,-1],
                [-1,4,4,4,4,4,4,-1]
            ];
            spawnStructure(res, x - 2, grassLevel - 6, STRUCTURE_HOME, false);
            homeCooldown = HOME_COOLDOWN_VAL;
        }
        homeCooldown--;
    }
    // TODO: caves
    return res;
}

/** Generate the whole world in the legacy style and return the result */
function legacyWorldGeneration(){
    // TODO: allow legacy worldgen to work with seeds
    var wMap = [];
    var biomes = [1,0,1,0,1];
    var maxBiomes = 2;
    var yWaterLevel = 35;
    var curY = 80 - yWaterLevel - 2;
    var mainY = 35;
    // for(var i=0;i<15;i++){
    //     biomes.push(Math.floor(Math.random() * (maxBiomes - 0 + 1) + 0));
    // }
    for(var i=0;i<80;i++){
        wMap.push([])
    }
    for(var i=0;i<biomes.length;i++){
        var fallFor = 50;
        var flatFor = 50;
        var riseFor = 50;
        var loopFor = 100;
        var rise = false;
        var fall = false;
        var flat = false;
        var biome = biomes[i];
        if(biome == 0){
            mainY = 80-11;
            if(curY <= 80-11){
                fallFor = (80-11) - curY;
                fall = true;
            } else {
                flat = true;
            }
            // riseFor = 0;
            // flatFor = Math.floor(Math.random() * (12 - 6 + 1) + 6);
            // loopFor = fallFor+flatFor+riseFor;
        } else if(biome == 1){
            mainY = 35;
            if(curY > mainY-2){
                riseFor = curY - (mainY-2);
                rise = true;
            } else if (curY < mainY+2){
                fallFor = (mainY+2) - curY;
                fall = true;
            } else {
                flat = true;
            }
            // flatFor = Math.floor(Math.random() * (15 - 6 + 1) + 6);
            // loopFor = fallFor+flatFor+riseFor;
        } else if(biome == 2){
            mainY = Math.floor(Math.random() * (16 - 7 + 1) + 7);
            if(curY > mainY){
                rise = true;
                riseFor = curY - mainY;
            }
            // fallFor = 80 - yWaterLevel + mainY;
            // loopFor = fallFor+riseFor+flatFor;
        }
        for(var l=0;l<loopFor;l++){
        var minLength = 0;
        var maxLength = 0;
        if(curY == mainY && biome == 1){
            fall = false;
            rise = false;
            flat = true;
        } else if(curY <= mainY){
            fall = true;
            rise = false;
            flat = false;
        }
        if(fall){
            var fallY = Math.floor(Math.random() * (1 - 1 + 1) + 1);
            if(biome == 0){
                if((curY+fallY)<=80-11){
                    curY += fallY;
                    minLength = 1;
                    maxLength = 4;
                } else if ((curY+fallY)>=80-11){
                    mainY = 80-11;
                    fall = false;
                    flat = true;
                }
            } else if(biome == 2){
                minLength = 0;
                maxLength = 2;
            }
        } else if(flat){
            var plainY = Math.floor(Math.random() * (1 - -1 + 1) + -1);
            if((curY+plainY) > mainY-2 && (curY+plainY) < mainY+2){
                curY += plainY;
            }
            
            minLength = 6;
            maxLength = 9;
        } else if(rise){
            var riseY = Math.floor(Math.random() * (-1 - -1 + 1) + -1);
            // if(curY+riseY>yWaterLevel){ //&& curY+riseY<yWaterLevel-3){
            //     curY += riseY;
            // }

            curY += riseY;
            if(biome == 2 && curY <= yWaterLevel){
                minLength = 0;
                maxLength = 2;
            } else {
                minLength = 1;
                maxLength = 4;
            }
            // if(biome == 2 && curY < yWaterLevel){
            //     minLength = 1;
            //     maxLength = 4;
            // } else if(biome == 2 && curY >= yWaterLevel){
            //     minLength = 0;
            //     maxLength = 3;
            // }
        }
            var distance = Math.floor(Math.random() * (maxLength - minLength + 1) + minLength);
            if(biome == 2 && Math.floor(Math.random() * (1 - 0 + 1) + 0) == 0){
                if(Math.floor(Math.random() * (1 - 0 + 1) + 0) == 1){
                    distance = 0;
                }
            }
            // var riseYy = Math.floor(Math.random()* (1 - 0 + 1) + 0);
            // if(riseYy == 0){
            //     riseY = 0
            // }
            // curY += Math.floor(Math.random() * (1 - 0 + 1) + 0);
            //Math.floor(Math.random() * (1 - 0 + 1) + 0) FOR OCEAN GENERATION
            //Math.floor(Math.random() * (1 - -1 + 1) + -1) FOR PLAINS GENERATION
            //Math.floor(Math.random() * (0 - -1 + 1) + -1) FOR MOUNTAINS GENERATION
                for(var ji=0;ji<distance;ji++){
                    for(var j=0;j<wMap.length;j++){
                        if(j<curY){
                            wMap[j].push(DBLOCKS[0]);
                        } else if (j == curY){
                            wMap[j].push(DBLOCKS[1]);
                        } else if(j > curY && j < curY+5){
                            wMap[j].push(DBLOCKS[4]);
                        } else if(j >= curY+5){
                            wMap[j].push(DBLOCKS[5]);
                        }
                    }
                }
            }
    }
    for(var i=(80 - yWaterLevel);i<wMap.length;i++){
        for(var l=0;l<wMap[i].length;l++){
            if(wMap[i][l][0] == 0){
                // wMap[i][l] = block[13];
                // block(i,l,13);
                wMap[i][l] = DBLOCKS[13]
            } else if(wMap[i][l][0] == 1){
                wMap[i][l] = DBLOCKS[20]
                wMap[i+1][l] = DBLOCKS[20]
                wMap[i-1][l] = DBLOCKS[20]
                
                // block(i,l,20);
                // block(i+1,l,20);
                // block(i-1,l,20);
            }
        }
    }
    // console.log(wMap)


    // TODO: fix worldspawn gen?
    //FIX THIS -- ITS WORLDSPAWN GENERATION
    /*var biomeLength = Math.floor((wMap[0].length-1)/biomes.length);
    var biomeSpawn = Math.random() * (biomes.length - 1) + 1;
    var xSpawnMax = biomeLength * biomeSpawn;
    var xSpawnMin = biomeLength * (biomeSpawn-1);
    var xSpawnPoint = Math.round(Math.random() * ((xSpawnMax-1) - xSpawnMin) + xSpawnMin);
    var ySpawnPoint = 0;
    for(var i=wMap.length-1;i>0;i--){
        if(wMap[i][xSpawnPoint][0] != 0 && wMap[i-1][xSpawnPoint][0] == 0 && wMap[i-2][xSpawnPoint][0] == 0){
            ySpawnPoint = wMap.length - i;
            break;
        }
    }
    worldSpawnPoint.x = (xSpawnPoint*36)+1;
    worldSpawnPoint.y = (ySpawnPoint*36)+1;
    player.pl = worldSpawnPoint.x;
    player.pr = worldSpawnPoint.x+34;
    player.pb = worldSpawnPoint.y;
    player.pt = worldSpawnPoint.y+69;
    gameOffsetY = worldSpawnPoint.y-(disp.height/2)+1;
    gameOffsetX = worldSpawnPoint.x-(disp.width/2)+1;
    for(var i=0;i<entities.length;i++){
        entities[i].pl = worldSpawnPoint.x;
        entities[i].pr = worldSpawnPoint.x+34;
        entities[i].pb = worldSpawnPoint.y;
        entities[i].pt = worldSpawnPoint.y+69;
    }
    for(var i=0;i<vehicles.length;i++){
        vehicles[i].x = worldSpawnPoint.x+220;
        vehicles[i].y = worldSpawnPoint.y;
    }*/
    return wMap;
}

/** Utility: pseudorandom number generation from a seed */
class pseudoRand {
    constructor(seed) {
        this.seed = seed;
        this.previous = this.seed;
    }
    next() {
        const PSEUDO_MAX = 2147483647;
        const next = this.previous * 16807 % PSEUDO_MAX;
        this.previous = next;
        return next / PSEUDO_MAX;
    }
}

/**
    Utility: set a world block to be a copy of a dblock
    Prevents reference issues and handles out of bounds errors
*/
function setBlock(map, x, y, blockId) {
    if (blockId < 0 || blockId >= DBLOCKS.length) {
        console.error("Attempted to set block to id " + blockId + ", which does not exist");
    }
    if (x < 0 || y < 0 || y >= map.length || x >= map[y].length) {
        console.error("Attempted to set block at (x: " + x + ", y: " + y + "), which is out of range");
    }
    // Copy to avoid reference issues
    map[y][x] = DBLOCKS[blockId].slice();
}

/**
    Utility: spawn a structure in the world
    The value -1 will count as "nothing" and will always yield to an already-existing non-air block
    If override land is true, any block will be overrideen; otherwise, only air will be overridden
*/
function spawnStructure(map, x, y, structureData, overrideLand = true) {
    for (let y1 = 0; y1 < structureData.length; y1++) {
        for (let x1 = 0; x1 < structureData[0].length; x1++) {
            // Don't override if the structure has "nothing"
            if (structureData[y1][x1] == -1) continue;
            // Yield to land
            if (!overrideLand && map[y + y1][x + x1][0] != 0) continue;
            setBlock(map, x + x1, y + y1, structureData[y1][x1]);
        }
    }
}
