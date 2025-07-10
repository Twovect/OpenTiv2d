/** Return a height map of what height each x coordinate should be, using only mountains */
function modernWorldgen(options) {
    const heights = [];
    for(let i = 0; i < options.worldWidth; i++){
        let newHeight = Math.floor(TivectWorldgenFunctions.mountains(i/10.0, options.seed)*DEFAULT_WORLDGEN_VERTICAL_SCALE);
        heights.push(newHeight)
    }
    return heights;
}

/** Return a height map of what height each x coordinate should be, using diverse biomes */
function diverseWorldgen(options) {
    const heights = [];
    const biomes = generateBiomes(options);
    for(let i = 0; i < options.worldWidth; i++){
        let newHeight = 1;
        if (biomes[i] == 0) {
            newHeight = Math.floor(TivectWorldgenFunctions.mountains(i/10.0, options.seed)*DEFAULT_WORLDGEN_VERTICAL_SCALE);
        } else if (biomes[i] == 1) {
            newHeight = Math.floor(TivectWorldgenFunctions.plateau(i/10.0, options.seed)*DEFAULT_WORLDGEN_VERTICAL_SCALE);
        } else if (biomes[i] == 1) {
            newHeight = Math.floor(TivectWorldgenFunctions.oceanFloor(i/10.0, options.seed)*0.3*DEFAULT_WORLDGEN_VERTICAL_SCALE);
        }
        const TRANSITION_LEN = 10;
        for (let j = 0; j < TRANSITION_LEN; j++) {
            if (i > j && biomes[i - j - 1] != biomes[i]) {
                newHeight = Math.floor((heights[i - 1] * (TRANSITION_LEN - j) + newHeight * j) / (1.0 * TRANSITION_LEN));
                previousBiome = biomes[i];
            }
        }
        heights.push(newHeight)
    }
    return heights;
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
function processHeightMap(hMap){
    var nMap = [];
    var width = hMap.length;
    var height = DEFAULT_WORLDGEN_HEIGHT;
    for(var i=0;i<height;i++){
        nMap.push([])
    }
    for(var i=0;i<width;i++){
        var grassLevel = height-(hMap[i]+height/2)
        var nearWaterLevel = grassLevel >= DEFAULT_WATER_LEVEL - 2;
        for(var j=0;j<height;j++){
            if (j<grassLevel && j < DEFAULT_WATER_LEVEL) {
                nMap[j].push(DBLOCKS[0]);
            }
            else if (j<grassLevel && j >= DEFAULT_WATER_LEVEL) {
                // Water
                nMap[j].push(DBLOCKS[13]);
            }
            else if (j == grassLevel) {
                // Grass level
                if (nearWaterLevel) {
                    nMap[j].push(DBLOCKS[20]);
                } else {
                    nMap[j].push(DBLOCKS[1]);
                }
            }
            else if (j > grassLevel && j < grassLevel+5) {
                // Dirt level
                if (nearWaterLevel && j < grassLevel + 2) {
                    nMap[j].push(DBLOCKS[20]);
                } else {
                    nMap[j].push(DBLOCKS[4]);
                }
            }
            else if (j >= grassLevel+5) {
                nMap[j].push(DBLOCKS[5]);
            }
        }
        // Fill in bodies of water also
    }
    return nMap;
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
