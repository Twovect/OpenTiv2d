const disp = document.getElementById("map");
const ctx = disp.getContext("2d");
ctx.imageSmoothingEnabled = false;
var multiplayer = false;
disp.height = 400;
disp.width = 650;
var blockSelect = 0;
var mapActive = 0;
var map = [
    [0,0,0],
    [0,0,0],
];
var vehicleMap = [];
var energyData = {
    type: null,
    level: null,
    available: null,
    energyUsed: null,
    power: 1000,
}
var size = 16;
var gameOffsetY = 0;
var gameOffsetX = 0;
var canClick = true;
function setUp(){
    var wMap = [];
    for(var i=0;i<300;i++){
        var ret = [];
        for(var j=0;j<1000;j++){
            ret.push(0);
        }
        wMap.push(ret);
    }
    map = wMap;
    gameOffsetX = Math.round(map[0].length/2);
    gameOffsetY = Math.round(map.length/2);
    reLoadCanv();
}
const eMap = [[0,1],[0,-1],[1,0],[-1,0]];
function energyPlace(x,y,block){
    if(activeEnBlock(block) == 1){
        energyTransfer(x,y);
    } else if(activeEnBlock(block) == 0){
        placeFrame(x,y);
    }
}
var energyBlocks = [
    [35,34],
    [40,41],
    [42,43],
];
function validCheck(y,x){
    return !(x > map[0].length-1 || x < 0 || y > map.length-1 || y < 0);
}
function activeEnBlock(val){
    for(var i=0;i<energyBlocks.length;i++){
        if(energyBlocks[i][0] == val){
            return 0;
        }
        if(energyBlocks[i][1] == val || val == 32){
            return 1;
        }
    }
    return -1;
}
function energyUseBlock(val){
    if(val == 32){
        return [32,32];
    }
    for(var i=0;i<energyBlocks.length;i++){
        if(val == energyBlocks[i][0] || val == energyBlocks[i][1]){
            return energyBlocks[i]
        }
    }
    return -1;
}
function energyRemoveT(x,y,block,energy){
    if(block != 34 || block != 32){
        removeEner(x,y,energy);
    }
}
function placeFrame(x,y){
    var largest = [0,0,0];
    for(var i=0;i<4;i++){
        if(validCheck(y+eMap[i][0],x+eMap[i][1]) && activeEnBlock(map[y+eMap[i][0]][x+eMap[i][1]][0]) != -1 && map[y+eMap[i][0]][x+eMap[i][1]][2] > largest[2]){
            largest[0] = y+eMap[i][0];
            largest[1] = x+eMap[i][1];
            largest[2] = map[y+eMap[i][0]][x+eMap[i][1]][2];
        }
    }
    energyTransfer(largest[1],largest[0]);
}
function energyTransfer(x,y){
    var energyLevel = map[y][x][2];
    if(energyLevel-1 > 0){
        for(var i=0;i<4;i++){
            if(validCheck(y+eMap[i][0],x+eMap[i][1])){
                var type = energyUseBlock(map[y+eMap[i][0]][x+eMap[i][1]][0]);
                if(type != 1 && energyLevel > map[y+eMap[i][0]][x+eMap[i][1]][2]){
                    map[y+eMap[i][0]][x+eMap[i][1]][0] = type[1];
                    map[y+eMap[i][0]][x+eMap[i][1]][2] = energyLevel-1;
                    energyTransfer(x+eMap[i][1],y+eMap[i][0]);
                }
            }
        }
    }
}
var energyArr = [];
function removeEner(x,y,energyLevel){
    energyArr = [];
    killEnergy(x,y,energyLevel);
    for(var i=0;i<energyArr.length;i++){
        energyTransfer(energyArr[i][1],energyArr[i][0]);
    }
}
function killEnergy(x,y,energyLevel){
    for(var i=0;i<4;i++){
        if(validCheck(y+eMap[i][0],x+eMap[i][1])){
            var type = energyUseBlock(map[y+eMap[i][0]][x+eMap[i][1]][0]);
            if(type != -1 && activeEnBlock(map[y+eMap[i][0]][x+eMap[i][1]][0]) == 1){
                if(map[y+eMap[i][0]][x+eMap[i][1]][2] < energyLevel){
                    map[y+eMap[i][0]][x+eMap[i][1]][0] = type[0];
                    map[y+eMap[i][0]][x+eMap[i][1]][2] = 0;
                    killEnergy(x+eMap[i][1],y+eMap[i][0],energyLevel)
                } else if(map[y+eMap[i][0]][x+eMap[i][1]][2] >= energyLevel){
                    energyArr.push([y+eMap[i][0],x+eMap[i][1]]);
                }
            }
        }
    }
}
function temp(){
    ctx.clearRect(0, 0, disp.width, disp.height);
    ctx.fillStyle = "#0e9dd6";
    ctx.fillRect(0, 0, disp.width, disp.height);
}
function validBlockClick(y,x){
    var ret = y > map.length-1 || y < 0 || x > map[0].length-1 || x < 0;
    return !ret;
}

function setVehicleBlockToId(y,x,blockId) {
    if (blockId > DBLOCKS.length-1 || blockId < 0){
        return;
    }
    // TODO: copy instead, to prevent reference issues??
    map[y][x] = DBLOCKS[blockId][0];
}

function clickEvent(ev) {
    var rect = disp.getBoundingClientRect();
    var xPos = controls.click[1] - rect.left + gameOffsetX*size;
    var yPos = controls.click[2] - rect.top - gameOffsetY*size;
    // var yAttackPos = gameOffsetY*size + disp.height - ev.clientY;
    var blockX = Math.floor(xPos / size);
    var blockY = Math.floor((yPos - disp.height) / size) + map.length;
    var placeBlock = true;
    if(controls.click[0] && canClick){
        canClick = false;
        setTimeout(function(){
            canClick = true;
        },10);
        if (placeBlock && validBlockClick(blockY,blockX)) {
            if (map.length - 1 >= blockY && blockY >= 0) {
                if (map[blockY].length - 1 >= blockX && blockX >= 0) {
                    var prevBlock = map[blockY][blockX];
                    if(activated == 1){
                        setVehicleBlockToId(blockY,blockX,blockSelect);
                        if(multiplayer){
                            ws.send(`build|${blockY}|${blockX}|${blockSelect}|${sid}`);
                        }
                        if(activeEnBlock(blockSelect) != 0 && activeEnBlock(prevBlock[0]) == 1){
                            energyRemoveT(blockX,blockY,blockSelect,prevBlock[2]);
                        }
                        if(activeEnBlock(blockSelect) != -1){
                            energyPlace(blockX,blockY,blockSelect);
                        }
                    } else if(activated == 0){
                        var data = [];
                        data.push(blockX);
                        data.push(blockY);
                        data.push(prevBlock[0]);
                        if(prevBlock[0] != 0){
                            // TODO: correct change?
                            //data.push(colors[prevBlock[0]-1][2]);
                            data.push(DBLOCKS[prevBlock[0]][2]);
                        } else {
                            data.push("air");
                        }
                        data.push(prevBlock[1]);
                        displayBData(data);
                    }
                    reLoadCanv();
                };
            };
        }
    };
};

var controls = {
    keys:[["ARROWRIGHT",false],["ARROWLEFT",false],["ARROWUP",false],["ARROWDOWN",false]],
    click:[false,0,0],
    control:function(e){
        const keyDown = (e.type == "keydown");
        for(var i=0;i<controls.keys.length;i++){
            if(controls.keys[i][0] == e.key.toUpperCase()){
                controls.keys[i][1] = keyDown;
                reLoadCanv();
                e.preventDefault();
            }
        }
    },
    mouse:function(e){
        const mouseDown = (e.type == "mousedown");
        controls.click[0] = mouseDown;
        if(mouseDown){
            controls.click[1] = e.clientX;
            controls.click[2] = e.clientY;
        }
    }
}
disp.addEventListener("mousedown", function (e) {;controls.mouse(e)});
disp.addEventListener("mouseup", function (e) {controls.mouse(e)});
window.addEventListener("keydown", controls.control);
window.addEventListener("keyup", controls.control);
document.addEventListener("mousemove", function (e){if(controls.click[0]){controls.click[1] = e.clientX;controls.click[2] = e.clientY}})

function getColor(blockId){
    if (blockId < 0 || blockId >= BLOCK_COLORS.length) {
        return "#000000";
    }
    return BLOCK_COLORS[blockId];
}
function drawSquare(x, y, val) {
    if (val != 0) {
        ctx.fillStyle = getColor(val);
        ctx.fillRect(x,y,size,size)
    };
};
function reLoadCanv(){
    ctx.clearRect(0, 0, disp.width, disp.height);
    ctx.fillStyle = "#0e9dd6";
    ctx.fillRect(0, 0, disp.width, disp.height);
    if(controls.keys[0][1]){
        controls.keys[0][1] = false;
        gameOffsetX += 1;
    }
    if(controls.keys[1][1]){
        controls.keys[1][1] = false;
        gameOffsetX -= 1;
    }
    if(controls.keys[2][1]){
        controls.keys[2][1] = false;
        gameOffsetY += 1;
    }
    if(controls.keys[3][1]){
        controls.keys[3][1] = false;
        gameOffsetY -= 1;
    }
    var jLeft = Math.floor(gameOffsetX*size / size);
    var jRight = jLeft + Math.ceil(disp.width / size);
    var iBottom = map.length - Math.floor(gameOffsetY*size / size)-1;
    var iTop = map.length - Math.ceil((disp.height+gameOffsetY*size) / size);
    if (jLeft < 0) {
        jLeft = 0;
    } else if (jLeft >= map[0].length) {
        jLeft = map[0].length - 1;
    };
    if (jRight >= map[0].length) {
        jRight = map[0].length - 1;
    } else if (jRight < 0) {
        jRight = 0;
    };
    if (iBottom < 0) {
        iBottom = 0;
    } else if (iBottom >= map.length) {
        iBottom = map.length - 1;
    };
    if (iTop >= map.length) {
        iTop = map.length - 1;
    } else if (iTop < 0) {
        iTop = 0;
    };
    for (var j = jLeft; j <= jRight; j++) {
        for (var i = iTop; i <= iBottom; i++) {
            var x = Math.floor(size * j - gameOffsetX*size);
            var y = Math.floor(gameOffsetY*size + disp.height - size * (map.length - i));
            if(mapActive == 0){
                drawSquare(x,y,map[i][j],2);
            }
        };
    };
}
setUp();
test();
function test(){
    clickEvent();
    window.requestAnimationFrame(test);

}
