function betterPow(a, b) {
    return Math.pow(Math.abs(a), b) * (
        (a < 0) ? -1 : 1
    );
}

function betterWorldGen(options) {
    const vals = [];
    const seed = parseInt(options.seed);
    const worldWidth = parseInt(options.worldWidth);
    for(let i = 0; i < worldWidth; i++){
        vals.push(Math.floor(worldGenMountain(i, seed)));
    }
    return vals;
}

function worldGenMountain(xh,seed) {
    let x = xh/10
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
    return res*DEFAULT_WORLDGEN_VERTICAL_SCALE;
}
