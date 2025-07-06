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

/*function worldGenMountain(xh,seed) {
    let x = xh/10;
    let res = 0;
    res += 3.5;
    let term2tosum = 0;
    for(let n = 1; n <= 20; n++) {
        let thisval = (
            1.0/4.0 * Math.sin(
                betterPow(Math.E, n/10.0) * (
                    x/5.0 + 60.0 + seed + betterPow(n, Math.cos(x)/20.0)
                )
            ) + 1.0/5.0 * Math.sin(
                betterPow(Math.E, (n+3.0)/10.0) * (
                    x/10.0 + 60.0 + seed
                )
            )
        );
        term2tosum += thisval;
    }
    let term2 = (
        4.0 * Math.atan(
            3.0/4.0 * (
                betterPow(term2tosum, 15.0/13.0)
            )
        )
    );
    res += term2;
    let term3tosum = 0;
    for(let n = 1; n <= 20; n++) {
        let thisval = (
            1.0/4.0 * Math.sin(
                betterPow(Math.E, n/10.0) * (
                    x/5.0 + 60.0 + 3 * seed + betterPow(n, Math.cos(x)/20.0)
                )
            ) + 1.0/5.0 * Math.sin(
                betterPow(Math.E, (n+3.0)/10.0) * (
                    x/2.0 + 60.0 + 2.0 * seed
                )
            )
        );
        term3tosum += thisval;
    }
    let term3 = (
        4.0/5.0 * Math.atan(
            3.0/4.0 * (
                betterPow(term3tosum, 15.0/13.0)
            )
        )
    )
    res += term3;
    return res;
}*/
