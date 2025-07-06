const disp = document.getElementById("canvas");
const ctx = disp.getContext("2d");
disp.height = window.innerHeight;
disp.width = window.innerWidth;
var version = "0.5.1_Fork";
var loaded = false;
var renderSize = 1;
var current = 0;
var fps = 30;
var prev = 0;
var map = INITIAL_MAP;
var rays = [];
var mapCoord = {x:0,y:0}
var worldSpawnPoint = {x:37,y:109}
var textures = [];
var itemTextures = [];
var wTextures = [];
var iTextures = [];
var hitPointImgs = [];
var barFrame = [];
var time = "day";
var gameOffsetX = 0;
var gameOffsetY = 0;
var gameCharacterActive = false;
var canClick = false;
var canHoldClick = true;
var mobileControls = false;
var multiplayer = false;
var playersPos = [];
var entities = DEFAULT_ENTITIES;
var vehicles = [];
var particels = [];
var projectiles = [];
var projectile;
var playerPic = [];
var entityImg = [];
var characters = [];
var arrowImg;
var electricEffect;
var blockSelect = 0;
var swordSelect = 0;
var energySelect = 0;
var clickAction = null;
//var energySources = [""];
var swordData = [
    {
        weapon: "punch",
        damage: 1,
        range: 3,
        knockback: 6,
    },
    {
        weapon: "firesword",
        rarity: "legendary",
        condition: "5",
        energyEnchant: false,
        damage: 65,
        range: 4,
        knockback: 2,
    },
    {
        weapon: "metalsword",
        damage: 7,
        range: 4,
        knockback: 6,
    },
]
var menuData = {
    block:{
        type:"blockMenu",
        purpose:"menu",
        bSlots:10,
        bRows:6,
        tabs:4,
        tabActive:1,
        mouseX:0,
        mouseY:0,
        highlighted:0,
    },
    item:{
        type:"itemMenu",
        purpose:"menu",
        bSlots:8,
        bRows:5,
        tabs:4,
        tabActive:3,
        mouseX:0,
        mouseY:0,
        highlighted:0,
    }
}
var vehicleInterface = {
    controls:{
        type:"interface",
        purpose:"vehicle",
        isVehicle:-1,
        mouseX:0,
        mouseY:0,
        tabs:0,
        select:[0,0],
        rows:[
            [[0,"X SPEED : "],[0,""]],
            [[0,"Y SPEED : "],[0,""]],
            [[0,"X : "],[0,""]],
            [[0,"Y : "],[0,""]],
            [[0,"CRUISE : "],[0,""]],
        ]
    },
    speedModifier:{
        type:"interface",
        purpose:"vehicleSpeed",
        isVehicle:-1,
        mouseX:0,
        mouseY:0,
        tabs:0,
        select:[0,0],
        rows:[
            [[0,"X MAXSPEED : "],[0,""]],
            [[0,"X CURRENT SPEED : "],[0,""]],
            [[0,"X SPEED : "],[3,5,""]],
            [[0,"Y MAXSPEED : "],[0,""]],
            [[0,"Y CURRENT SPEED : "],[0,""]],
            [[0,"Y SPEED : "],[3,5,""]],
        ]
    }
}
var counter = [
    {
        id:"Money",
        prefix:"",
        suffix:"",
        out:0,
        serversActive:0,
        visible:false,
    }
]
var menuActive = [false, menuData.block];
/*var energyData = {
    type: null,
    level: null,
    available: null,
    energyUsed: null,
    power: ENERGY_DATA_POWER,
}*/

function setWorldBlockToId(y,x,blockId) {
    console.log("Placing at (y: " + y + ", x: " + x + ")")
    if (blockId > DBLOCKS.length-1 || blockId < 0){
        return;
    }
    // TODO: copy instead, to prevent reference issues??
    map[y][x] = DBLOCKS[blockId];
}

var player = {
    pl: 0,
    pr: 34,
    pt: 69,
    pb: 0,
    jumping: true,
    inWater: false,
    inLeaves: false,
    electric: false,
    velX: 0,
    velY: 0,
    inVehicle:-1,
    controllingVehicle:false,
    health:30,
    color:0,
    mass:350,
    onBlocks:[],
    inventory: {type:"storage",purpose:"inventory",mouseX:0,mouseY:0,row:0,tabs:4,tabActive:1,highlighted:0,inventory:[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]},
    itemBar:[
        // Documentation:
        // clickAction: (???)
        // select: which block ID is selected
        // amount: (???)
        // data: (???)
        {clickAction:2,select:0,amount:true,data:[null,null]},
        {clickAction:2,select:0,amount:true,data:[null,null]},
        {clickAction:2,select:0,amount:true,data:[null,null]},
        {clickAction:2,select:0,amount:true,data:[null,null]},
        {clickAction:2,select:0,amount:true,data:[null,null]},
    ],
    selected:2,
};
function respawn() {
    if(multiplayer){
        ws.send(`respawn|${sid}`);
    }
    player.pl = worldSpawnPoint.x,
    player.pr = worldSpawnPoint.x+34,
    player.pt = worldSpawnPoint.y+69,
    player.pb = worldSpawnPoint.y,
    player.jumping = true;
    player.inLeaves = false,
    player.inWater = false,
    player.electric = false;
    player.velX = 0;
    player.velY = 0;
    player.inVehicle = -1;
    menuActive[0] = false;
    gameOffsetY = worldSpawnPoint.y-(disp.height/2)+1;
    gameOffsetX = worldSpawnPoint.x-(disp.width/2)+1;
    player.health = 30;
};
function knockedback(intensity){
    
}
function changeClick() {
    if (controls.keys[7][1]) {
        controls.keys[7][1] = false;
        clickAction = null;
    };
    if (controls.keys[8][1]) {
        controls.keys[8][1] = false;
        if(menuActive[0]){
            menuPress(1);
        } else {
            player.selected = 0;
        }
    };
    if (controls.keys[9][1]) {
        controls.keys[9][1] = false;
        if(menuActive[0]){
            menuPress(2);
        } else {
            player.selected = 1;
        }
    };
    if(controls.keys[10][1]) {
        controls.keys[10][1] = false;
        if(menuActive[0]){
            menuPress(3);
        } else {
            player.selected = 2;
        }
    }
    if(controls.keys[11][1]) {
        controls.keys[11][1] = false;
        if(menuActive[0]){
            menuPress(4);
        } else {
            player.selected = 3;
        }
    }
    if(controls.keys[12][1]) {
        controls.keys[12][1] = false;
        if(menuActive[0]){
            menuPress(5);
        } else {
            player.selected = 4;
        }
    }
};
function min(a, b) { return a < b ? a : b; }
function max(a, b) { return a > b ? a : b; }
var blockClickTypes = [
    ["safe",[[37,0]]],
    ["counter",[[43,0],[41,1]]],
];
function blockClickType(val){
    for(var i=0;i<blockClickTypes.length;i++){
        for(var j=0;j<blockClickTypes[i][1].length;j++){
            if(blockClickTypes[i][1][j][0] == val){
                return [blockClickTypes[i][0],blockClickTypes[i][1][j][1]];
            }
        }
    }
    return -1;
}
function validBlockClick(y,x){
    var ret = y > map.length-1 || y < 0 || x > map[0].length-1 || x < 0;
    return !ret;
}
function validVehicleBlock(y,x,val){
    var ret = y > vehicles[val].map.length-1 || y < 0 || x > vehicles[val].map[0].length-1 || x < 0;
    return !ret;
}
// function energySwitchThing(x,y,item){
//     if(map[y][x] == 31 || map[y][x] == 30 || map[y][x] == 38){
//         if(map[y][x][2] <= 0 && item == 3){
//             map[y][x][3] = iBlocks[i][2];
//             map[y][x][0] = 31;
//         } else if(map[y][x][2] > 0 && item == 3){
//             map[y][x][3] = iBlocks[i][2];
//             map[y][x][0] = 38;
//         } else if(map[y][x][2] > 0 && item == 2){
//             map[y][x][3] = iBlocks[i][2];
//             map[y][x][0] = 30;
//         }
//     }
// }
// function changeSwitchState(y,x,item){
//     var iBlocks = [[31,[3,2]],[30,[3,2]],[38,[3,2]]];
//     for(var i=0;i<iBlocks.length;i++){
//         if(map[y][x][0] == iBlocks[i][0]){
//             for(var j=0;j<iBlocks[i][1].length;j++){
//                 if(iBlocks[i][1][j] == player.itemBar[player.selected].select){
//                     energySwitchThing(x,y,item);
//                 }
//             }
//         }
//     }
// }
function changeBlockState(y,x,item){
    var iBlocks = [[[31,3,false],[38,3,false],[30,2,true]]];
    for(var i=0;i<iBlocks.length;i++){
        for(var j=0;j<iBlocks[i].length;j++){
            if(i == 0 && map[y][x][0] == iBlocks[i][j][0] && item == iBlocks[i][j][1]){
                energySwitch(y,x,item)
            } else if(map[y][x][0] == iBlocks[i][j][0] && item == iBlocks[i][j][1]){

            }
        }
    }
}
function energySwitch(y,x,item){
    var iBlocks = [[31,3,false],[38,3,false],[30,2,true]];
    for(var i=0;i<iBlocks.length;i++){
        if(map[y][x][0] == iBlocks[i][0] && item == iBlocks[i][1]){
            if(map[y][x][2] <= 0){
                map[y][x][3] = iBlocks[i][2];
                map[y][x][0] = 31;
            } else if(map[y][x][2] > 0 && iBlocks[i][j][2] == false){
                map[y][x][3] = iBlocks[i][2];
                map[y][x][0] = 38;
            } else if(map[y][x][2] > 0 && iBlocks[i][j][2] == true){
                map[y][x][3] = iBlocks[i][2];
                map[y][x][0] = 30;
            }
        }
    }
}
function changeItemState(){
    var item = player.itemBar[player.selected].select;
    var iBlocks = [[[2,true],[3,true]],[[4,false],[5,false]]];
    for(var i=0;i<iBlocks.length;i++){
        if(item == iBlocks[i][0][0] || item == iBlocks[i][1][0]){
            if(item == iBlocks[i][0][0]){
                player.itemBar[player.selected].select = iBlocks[i][1][0];
                if(iBlocks[i][1][1] && player.itemBar[player.selected].data[0] != null && player.itemBar[player.selected].data[1] != null){
                    changeBlockState(player.itemBar[player.selected].data[0], player.itemBar[player.selected].data[1], iBlocks[i][1][0]);
                }
            } else {
                player.itemBar[player.selected].select = iBlocks[i][0][0];
                if(iBlocks[i][0][1] && player.itemBar[player.selected].data[0] != null && player.itemBar[player.selected].data[1] != null){
                    changeBlockState(player.itemBar[player.selected].data[0], player.itemBar[player.selected].data[1], iBlocks[i][0][0]);
                }
            }
        }
    }
}
function validItemClickBlock(y,x){
    var iBlocks = [[31,[3,2]],[30,[3,2]],[38,[3,2]]];
    for(var i=0;i<iBlocks.length;i++){
        if(map[y][x][0] == iBlocks[i][0]){
            for(var j=0;j<iBlocks[i][1].length;j++){
                if(iBlocks[i][1][j] == player.itemBar[player.selected].select){
                    return true;
                }
            }
            return false;
        }
    }
    return false;
}
function blockMultiCheck(y,x){
    if(overlap(y,x,player.pl,player.pt,player.pr,player.pb)){
        return true;
    }
    for(var i=0;i<entities.length;i++){
        if(overlap(y,x,entities[i].pl,entities[i].pt,entities[i].pr,entities[i].pb)){
            return true;
        }
    }
    if(multiplayer){
        for(var i=0;i<playersPos.length;i++){
            if(overlap(y,x,playersPos[i].pl,playersPos[i].pt,playersPos[i].pr,playersPos[i].pb)){
                return true;
            }
        }
    }
    return false;
}
function clickEntity(xPos,yPos){
    for(var i=0;i<entities.length;i++){
        if(entities[i].type == 2){
            if(buttonClick(xPos,yPos,entities[i].pt-gameOffsetY,entities[i].pb-gameOffsetY,entities[i].pr-gameOffsetX,entities[i].pl-gameOffsetX)){
                menuActive[1] = entities[i].traderMenu;
                menuActive[0] = true;
            }
        }
    }
}
function clickBtn(){
    var xPos = menuActive[1].mouseX;
    var yPos = menuActive[1].mouseY;
    var tab = 0;
    if(menuActive[1].tabs > 0){
        tab = 1;
    }
    if(menuActive[1].type == "blockMenu"){
        var mWidth = menuActive[1].bSlots*50+12*(menuActive[1].bSlots+1);
        var mHeight = menuActive[1].bRows*50+12*(menuActive[1].bRows+1)+tab*(12+81);
        var x = (disp.width-mWidth)/2;
        var y = (disp.height-mHeight)/2;
        var yTop = (disp.height-mHeight)/2+mHeight;
        for(var i=0;i<menuActive[1].bSlots;i++){
            for(var j=0;j<menuActive[1].bRows;j++){
                if(buttonClick(xPos,yPos,yTop-12*(j+1)-50*j,yTop-12*(j+1)-50*(j+1),x+12*(i+1)+50*(i+1),x+12*(i+1)+50*i)){
                    if(j*menuActive[1].bSlots+i < BLOCK_SOURCES.length){
                        menuActive[1].highlighted = j*menuActive[1].bSlots+i;
                    }
                }
            }
        }
        clickTab(xPos,yPos,x,y,tab)
    } else if(menuActive[1].type == "tradeMenu"){
        var mWidth = menuActive[1].bSlots*50+12*(menuActive[1].bSlots+1);
        var mHeight = menuActive[1].trades.length*50+12*(menuActive[1].trades.length+1);
        var x = (disp.width-mWidth)/2;
        var y = (disp.height-mHeight)/2+mHeight;
        for(var i=0;i<menuActive[1].bSlots;i++){
            for(var j=0;j<menuActive[1].trades.length;j++){
                if(i == 0 || i == 4){
                    if(buttonClick(xPos,yPos,y-12*(j+1)-50*j,y-12*(j+1)-50*(j+1),x+12*(i+1)+50*(i+1),x+12*(i+1)+50*i)){
                        menuActive[1].highlighted = i;
                        menuActive[1].row = j;
                    }
                }
            }
        }
    } else if(menuActive[1].type == "storage"){
        var bRows = menuActive[1].inventory.length;
        var bSlots = menuActive[1].inventory[0].length;
        var mWidth = bSlots*50+12*(bSlots+1);
        var mHeight = bRows*50+12*(bRows+1)+tab*(12+81);
        var x = (disp.width-mWidth)/2;
        var y = (disp.height-mHeight)/2+mHeight;
        var yBottom = (disp.height-mHeight)/2;
        for(var i=0;i<bSlots;i++){
            for(var j=0;j<bRows;j++){
                if(buttonClick(xPos,yPos,y-12*(j+1)-50*j,y-12*(j+1)-50*(j+1),x+12*(i+1)+50*(i+1),x+12*(i+1)+50*i)){
                    menuActive[1].highlighted = i;
                    menuActive[1].row = j;
                }
            }
        }
        clickTab(xPos,yPos,x,yBottom,tab)
    } else if(menuActive[1].type == "itemMenu"){
        var mWidth = menuActive[1].bSlots*50+12*(menuActive[1].bSlots+1);
        var mHeight = menuActive[1].bRows*50+12*(menuActive[1].bRows+1)+tab*(12+81);
        var x = (disp.width-mWidth)/2;
        var y = (disp.height-mHeight)/2;
        var yTop = (disp.height-mHeight)/2+mHeight;
        for(var i=0;i<menuActive[1].bSlots;i++){
            for(var j=0;j<menuActive[1].bRows;j++){
                if(buttonClick(xPos,yPos,yTop-12*(j+1)-50*j,yTop-12*(j+1)-50*(j+1),x+12*(i+1)+50*(i+1),x+12*(i+1)+50*i)){
                    if(j*menuActive[1].bSlots+i < ITEM_SOURCES.length){
                        menuActive[1].highlighted = j*menuActive[1].bSlots+i;
                    }
                }
            }
        }
        clickTab(xPos,yPos,x,y,tab)
    } else if(menuActive[1].type == "interface"){
        var tWidth = interfaceWidth();
        var mWidth = tWidth*20+6;
        var mHeight = menuActive[1].rows.length*36+6-8;
        var x = (disp.width-mWidth)/2;
        var y = (disp.height-mHeight)/2;
        var yTop = (disp.height-mHeight)/2+mHeight;
        for(var i=0;i<menuActive[1].rows.length;i++){
            var tLen = 0;
            for(var j=0;j<menuActive[1].rows[i].length;j++){
                if(menuActive[1].rows[i][j][0] == 1 || menuActive[1].rows[i][j][0] == 2 || menuActive[1].rows[i][j][0] == 3){
                    var rectWidth = menuActive[1].rows[i][j][1] * 20;
                    if(buttonClick(xPos,yPos,yTop-4-36*i,yTop-36*(i+1)+4,x+6+tLen*20+rectWidth-2,x+6+tLen*20)){
                        menuActive[1].select[0] = i;
                        menuActive[1].select[1] = j;
                    }
                }
                if(menuActive[1].rows[i][j][0] == 0){
                    tLen += menuActive[1].rows[i][j][1].length;
                } else {
                    tLen += menuActive[1].rows[i][j][1];
                }
            }
        }
    }
}
function clickTab(xPos,yPos,x,y,tab){
    if(tab == 1){
        for(var i=0;i<menuActive[1].tabs;i++){
            if(buttonClick(xPos,yPos,y+12+80,y+12,x+12*(i+1)+80*(i+1),x+12*(i+1)+80*i)){
                menuActive[1].tabActive = i+1;
                if(menuActive[1].tabActive == 1){
                    menuData.block.tabActive = 1;
                    menuActive[1] = menuData.block;
                } else if(menuActive[1].tabActive == 2){

                } else if(menuActive[1].tabActive == 3){
                    menuData.item.tabActive = 3;
                    menuActive[1] = menuData.item;
                } else if(menuActive[1].tabActive == 4){
                    player.inventory.tabActive = 4;
                    menuActive[1] = player.inventory;
                }
            }
        }
    }
}
function genItemID(){
    const chars = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var id = "";
    for(var i=0;i<8;i++){
        id += chars[Math.floor(Math.random() * (chars.length-1 - 0)+0)];
    }
    for(var i=0;i<projectiles.length;i++){
        if(projectiles[i].id == id){
            id = genItemID();
        }
    }
    for(var i=0;i<vehicles.length;i++){
        if(vehicles[i].id == id){
            id = genItemID();
        }
    }
    return id;
}
function createItem(val,clickAction,y,x,velX,velY){
    var itemId = genItemID();
    if(val != 0){
        if(clickAction == 0 || clickAction == 2){
            projectiles.push({type:"item",id:itemId,clickAction:clickAction,select:val,velX:velX,velY:velY,pl:x,pr:x+24,pb:y,pt:y+24,stop:[false,false]});
        } else if(clickAction == 1){
            projectiles.push({type:"item",id:itemId,clickAction:clickAction,select:val,velX:velX,velY:velY,pl:x,pr:x+18,pb:y,pt:y+80,stop:[false,false]});
        }
    }
}
function dropItem(){
    var drop = player.selected;
    var x1 = (player.pr+player.pl-18)/2;
    var y1 = (player.pt + player.pb-18)/2;
    var yVel = 0;
    var xVel = 0;
    if(!controls.keys[1][1] || !controls.keys[2][1]){
        if(controls.keys[1][1]){
            yVel = 0.1;
            xVel = -0.3;
            if(controls.keys[3][1]){
                xVel -= 0.18;
            }
        } else if(controls.keys[2][1]){
            yVel = 0.1;
            xVel = 0.3;
            if(controls.keys[3][1]){
                xVel += 0.18;
            }
        }
    }
    if(player.itemBar[drop].select != 0){
        var itemId = genItemID();
        if(player.itemBar[drop].clickAction == 2 || player.itemBar[drop].clickAction == 0){
            projectiles.push({type:"item",id:itemId,clickAction:player.itemBar[drop].clickAction,select:player.itemBar[drop].select,velX:xVel,velY:yVel,pl:x1,pr:x1+24,pb:y1,pt:y1+24,stop:[false,false]});
        } else if(player.itemBar[drop].clickAction == 1){
            projectiles.push({type:"item",id:itemId,clickAction:player.itemBar[drop].clickAction,select:player.itemBar[drop].select,velX:xVel,velY:yVel,pl:x1,pr:x1+18,pb:y1,pt:y1+80,stop:[false,false]});
        }
        if(multiplayer){
            ws.send(`addProj|item|${itemId}|${player.itemBar[drop].clickAction}|${player.itemBar[drop].select}|${xVel}|${yVel}|${x1}|${y1}|${sid}`);
        }
        player.itemBar[drop].select = 0;
    }
}
function shootProjectile(x1,y1,x2,y2,type){
    var xVal = x2-x1;
    var yVal = y2-y1;
    var divideBy = Math.sqrt(xVal*xVal+yVal*yVal);
    var xIncrement = (xVal/divideBy);
    var yIncrement = (yVal/divideBy);
    var xStart = player.pr-player.pl;
    // console.log(xStart)
    projectiles.push({type:type,id:genItemID(),velX:xIncrement,velY:yIncrement,pl:x1,pr:x1+18,pb:y1,pt:y1+18,stop:[false,false]});
    // projectiles.push({type:"item",id:genItemID(),clickAction:1,select:2,velX:xIncrement,velY:yIncrement,pl:x1,pr:x1+18,pb:y1,pt:y1+80,stop:[false,false]});
}
function removeProjectile(id){
    var newProj = [];
    for(var i=0;i<projectiles.length;i++){
        if(projectiles[i].id != id){
            newProj.push(projectiles[i]);
        }
    }
    projectiles = newProj;
}
function getLine(x1,y1,x2,y2){
    var xVal = x2-x1;
    var yVal = y2-y1;
    var slope = yVal/xVal;
    var yIntercept = (-1*slope)*x1+y1;
    return [slope,yIntercept];
}
function small(num1,num2){
    if(num1-num2 < 0){
        return num1;
    } else {
        return num2;
    }
}
function big(num1,num2){
    if(num1-num2 < 0){
        return num2;
    } else {
        return num1;
    }
}
function checkIntersect(x1,y1,x2,y2,xIntersect,yIntersect){
    if(x1 != x2){
        return small(x1,x2) <= xIntersect && xIntersect <= big(x1,x2);
    } else {
        return small(y1,y2) <= yIntersect && yIntersect <= big(y1,y2);
    }
}
function intersectBlock(x1,y1,x2,y2,x3,y3,x4,y4){
    //STILL NEEDS TO CHECK WHEN THE LINES ARE BOTH THE SAME SLOPE AND OVERLAPPING
    if(x1 == x2 && x3 == x4){
        return false;
    }
    var line1;
    var line2;
    if(x1 == x2){
        line1 = [null,0];
    } else {
        line1 = getLine(x1,y1,x2,y2);
    }
    if(x3 == x4){
        line2 = [null,1];
    } else {
        line2 = getLine(x3,y3,x4,y4);
    }
    if(line1[0] == line2[0] && line1[1] != line2[1]){
        return false;
    }
    var xIntersect = 0;
    var yIntersect = 0;
    if(x1 == x2){
        xIntersect = x1;
        yIntersect = line2[0]*x1+line2[1];
    } else if(x3 == x4){
        xIntersect = x3;
        yIntersect = line1[0]*x3+line1[1];
    } else {
        xIntersect = -1*(line2[1]-line1[1])/(line2[0]-line1[0]);
    }
    if(checkIntersect(x1,y1,x2,y2,xIntersect,yIntersect) && checkIntersect(x3,y3,x4,y4,xIntersect,yIntersect)){
        return true;
    } else {
        return false;
    }
}
function checkEntityBarrier(i,dir){
    var xPos = entities[i].pr - entities[i].pl;
    var yPos = entities[i].pt - entities[i].pb;
    var blockX = Math.floor(xPos / 36);
    var blockY = Math.floor((yPos - disp.height) / 36) + map.length;
    var bt = blockY*36;
    var bb = bt+36;
    var bl = blockX*36;
    var br = bl + 36;
    // var xDir = if(xPos)
    // var yDir = true;
    var playerP = [player.pl,player.pr,player.pt,player.pb];
    // if(dir != )
    //add a loop so it will check the each border of a block
    for(var j=0;j<4;j++){
    intersectBlock(player.pl,player.pt,xPos,yPos);
    intersectBlock(player.pl,player.pb,xPos,yPos);
    intersectBlock(player.pr,player.pt,xPos,yPos);
    intersectBlock(player.pr,player.pb,xPos,yPos);
    }
}
//
//
//
//
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
    // [38,30], //this is the switch block stuff
    // [31,38], //this is the switch block stuff
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
//
//
//
//use this to make raytracing for weapons specifically melee weapons
function linesOverlap(x1, y1, x2, y2, x3, y3, x4, y4) {
    var eps = 1e-2;
    var r = [x1 - x3, y1 - y3];
    var v1 = [x2 - x1, y2 - y1];
    var v2 = [x4 - x3, y4 - y3];
    if (zero(cross(v1, v2), eps)) {
        return false;
    } else if (zero(norm(v1), eps) || zero(norm(v2), eps)) {
        return false;
    } else {
        var t1 = 0, t2 = 0;
        if (zero(v1[0], eps)) {
            t2 = r[0] / v2[0];
        } else if (zero(v1[1], eps)) {
            t2 = r[1] / v2[1];
        } else {
            t2 = (r[0] * v1[1] - r[1] * v1[0]) / (v1[1] * v2[0] - v2[1] * v1[0]);
        }
        if (zero(v2[0], eps)) {
            t1 = -r[0] / v1[0];
        } else if (zero(v2[1], eps)) {
            t1 = -r[1] / v1[1];
        } else {
            t1 = (r[1] * v2[0] - r[0] * v2[1]) / (v1[0] * v2[1] - v1[1] * v2[0]);
        }
        return 0 <= t1 && t1 <= 1 && 0 <= t2 && t2 <= 1;
    }
}
function zero(x, eps) {
    return Math.abs(x) < eps;
}
function norm(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}
function cross(a, b) {
    return a[0] * b[1] - b[0] * a[1];
}
var controls = {
    keys:[[" ",false],["A",false],["D",false],["W",false],["S",false],["F",false],[".",false],["`",false],["1",false],["2",false],["3",false],["4",false],["5",false],["M",false],["L",false],["O",false],["C",false]],
    click:[false,0,0],
    control:function(e){
        const keyDown = (e.type == "keydown");
        const keyUp = (e.type == "keyup");
        if(menuActive[0] && menuActive[1].type == "interface"){
            if(keyDown){
                interfaceType(e.key.toUpperCase());
            }
        }
        for(var i=0;i<controls.keys.length;i++){
            if(controls.keys[i][0] == e.key.toUpperCase()){
                if(controls.keys[i][0] == -1){
                    controls.keys[i][1] = keyUp;
                } else {
                    controls.keys[i][1] = keyDown;
                }
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
disp.addEventListener("mousedown", function (e) {/*clickEvent(e)*/;controls.mouse(e)});
disp.addEventListener("mouseup", function (e) {controls.mouse(e)});
document.addEventListener("mousemove", function (e){if(controls.click[0]){controls.click[1] = e.clientX;controls.click[2] = e.clientY}})
window.addEventListener("keydown", controls.control);
window.addEventListener("keyup", controls.control);
function isSolid(val) {
    if (val != 0 && val != 9 && val != 10 && val != 11 && val != 13 && val != 14 && val != 17 && val != 29 && val != 36) {
        return true;
    }
    return false;
};
function gameSetup() {
    if(!loaded){
        loaded = true;
        for(var j = 0; j < BLOCK_SOURCES.length; j++) {
            textures[j] = document.createElement("IMG");
            if (j != 0) {
                textures[j].src = 'assets/textures/' + BLOCK_SOURCES[j];
            };
        };
        for(var j = 0; j < SWORD_SOURCES.length; j++) {
            wTextures[j] = document.createElement("IMG");
            if (j != 0) {
                wTextures[j].src = 'assets/textures/' + SWORD_SOURCES[j];
            }
        }
        for(var j = 0; j < ENTITY_SOURCES.length; j++) {
            entityImg[j] = document.createElement("IMG");
            if (j != 0) {
                entityImg[j].src = 'assets/textures/' + ENTITY_SOURCES[j];
            }
        }
        for(var j=0;j<3;j++){
            hitPointImgs[j] = document.createElement("IMG");
            hitPointImgs[j].src = 'assets/textures/' + HIT_POINT_SOURCES[j];
        }
        for(var j=0;j<2;j++){
            barFrame[j] = document.createElement("IMG");
            barFrame[j].src = 'assets/textures/' + BAR_FRAME_SOURCES[j];
        }
        for(var j=0;j<PLAYER_SOURCES.length;j++){
            playerPic[j] = document.createElement("IMG");
            playerPic[j].src = "assets/textures/"+PLAYER_SOURCES[j];
        }
        for(var j=0;j<ITEM_SOURCES.length;j++){
            iTextures[j] = document.createElement("IMG");
            if (j != 0) {
                iTextures[j].src = "assets/textures/"+ITEM_SOURCES[j];
            }
        }
        for(var j=0;j<CHAR_SOURCES.length;j++){
            characters[j] = document.createElement("IMG");
            if (j != 0) {
                characters[j].src = "assets/textures/chars/"+CHAR_SOURCES[j];
            }
        }
        arrowImg = document.createElement("IMG");
        arrowImg.src = "assets/textures/arrowRight.png";
        projectile = document.createElement("IMG");
        projectile.src = "assets/textures/metalProjectile.png";
        electricEffect = document.createElement("IMG");
        electricEffect.src = "assets/textures/electricEffect.png";
        // Sync the player with the game options
        player.color = gameOptions.playerColor;
        // Generate world in multiplayer only
        if(!multiplayer) {
            if (gameOptions.worldgenMethod == 0) {
                // Modern
                let heights = modernWorldgen(gameOptions);
                map = processHeightMap(heights);
            } else if (gameOptions.worldgenMethod == 1) {
                // Diverse
                let heights = diverseWorldgen(gameOptions);
                map = processHeightMap(heights);
            } else {
                // Legacy
                legacyWorldGeneration();
            }
            const seedPercent = ((gameOptions.seed + 12345) % 1000) / 1000.0;
            var xSpawnPoint = Math.round(seedPercent * ((map[0].length-1) - 0) + 0);
            var ySpawnPoint = 0;
            /*for (let y = 0; y < map.length; ++y) {
                if (map[y][xSpawnPoint][0] == 0) {
                vals[xSpawnPoint];
            }*/
            for(var i=map.length-1;i>0;i--){
                if(map[i][xSpawnPoint][0] != 0 && map[i-1][xSpawnPoint][0] == 0 && map[i-2][xSpawnPoint][0] == 0){
                    ySpawnPoint = map.length - i;
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
            }
        }
        gameCharacterActive = true;
        renderFrame();
        // setInterval(useControls,1000/60);
        respawn();
    }
}
function processHeightMap(hMap){
    var nMap = [];
    var width = hMap.length;
    var height = DEFAULT_WORLDGEN_HEIGHT;
    for(var i=0;i<height;i++){
        nMap.push([])
    }
    for(var i=0;i<width;i++){
        var aVal = height-(hMap[i]+height/2)
        for(var j=0;j<height;j++){
            if (j<aVal && j < DEFAULT_WATER_LEVEL) {
                nMap[j].push(DBLOCKS[0]);
            }
            else if (j<aVal && j >= DEFAULT_WATER_LEVEL) {
                nMap[j].push(DBLOCKS[13]); // Water
            }
            else if (j == aVal) {
                nMap[j].push(DBLOCKS[1]);
            }
            else if (j > aVal && j < aVal+5) {
                nMap[j].push(DBLOCKS[4]);
            }
            else if (j >= aVal+5) {
                nMap[j].push(DBLOCKS[5]);
            }
        }
        // Fill in bodies of water also
    }
    return nMap;
}
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


    //FIX THIS -- ITS WORLDSPAWN GENERATION
    var biomeLength = Math.floor((wMap[0].length-1)/biomes.length);
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
    }
    map = wMap;
}
function drawSquare(x, y, val,clickAction) {
    if (val != 0) {
        if(clickAction == 2){
            ctx.drawImage(textures[val], 0, 0, 36, 36, Math.ceil(x*renderSize), Math.ceil(y*renderSize), Math.ceil(36*renderSize), Math.ceil(36*renderSize));
        } else if(clickAction == 0){
            ctx.drawImage(itemTextures[val], 0, 0, 36, 36, Math.ceil(x*renderSize), Math.ceil(y*renderSize), Math.ceil(36*renderSize), Math.ceil(36*renderSize));
        }
    };
};
function drawItem(x, y, val){
    if (val != 0) {
        ctx.drawImage(iTextures[val], 0, 0, 36, 36, Math.ceil(x*renderSize), Math.ceil(y*renderSize), Math.ceil(36*renderSize), Math.ceil(36*renderSize));
    };
}
function drawSword(x,y,val,swordSize){
    if(swordSize == 0){
        ctx.drawImage(wTextures[val], 0, 0, 24, 90, Math.ceil(x*renderSize), Math.ceil(y*renderSize), Math.ceil(12*renderSize), Math.ceil(45*renderSize));
    } else if(swordSize == 1){
        ctx.drawImage(wTextures[val], 0, 0, 24, 90, Math.ceil(x*renderSize), Math.ceil(y*renderSize), Math.ceil(16*renderSize), Math.ceil(60*renderSize));
    } else if(swordSize == 2){
        ctx.drawImage(wTextures[val], 0, 0, 24, 90, Math.ceil(x*renderSize), Math.ceil(y*renderSize), Math.ceil(24*renderSize), Math.ceil(90*renderSize));
    }
}
function drawWeapon() {
    ctx.drawImage(wTextures[player.itemBar[player.selected].select], 0, 0, 24, 90, player.pl - gameOffsetX - 8, gameOffsetY + disp.height - player.pt + 3, 12, 45);
}

// Select an item in the menu
function menuPress(num){
    if(menuActive[1].type == "blockMenu"){
        player.itemBar[num-1].data = [null,null];
        player.itemBar[num-1].clickAction = 2;
        player.itemBar[num-1].select = menuActive[1].highlighted;
    } else if(menuActive[1].type == "itemMenu"){
        player.itemBar[num-1].data = [null,null];
        player.itemBar[num-1].clickAction = 0;
        player.itemBar[num-1].select = menuActive[1].highlighted;
    } else if(menuActive[1].type == "tradeMenu"){
        if(menuActive[1].highlighted == 0){
            //menuActive[1].trades[menuActive[1].row][2][0] maybe
            if(menuActive[1].trades[menuActive[1].row][2] != 0 && player.itemBar[num-1].select == 0){
                player.itemBar[num-1].select = menuActive[1].trades[menuActive[1].row][2];
                menuActive[1].trades[menuActive[1].row][2] = 0;
            } else if(menuActive[1].trades[menuActive[1].row][2] == 0 && player.itemBar[num-1].select != 0){
                menuActive[1].trades[menuActive[1].row][2] = player.itemBar[num-1].select;
                player.itemBar[num-1].select = 0;
            }
        } else if(menuActive[1].highlighted == 4 && menuActive[1].trades[menuActive[1].row][2] == menuActive[1].trades[menuActive[1].row][0] && player.itemBar[num-1].select == 0){
            menuActive[1].trades[menuActive[1].row][2] = 0;
            player.itemBar[num-1].select = menuActive[1].trades[menuActive[1].row][1];
        }
    } else if(menuActive[1].type == "storage"){
        if(player.itemBar[num-1].select != 0 && menuActive[1].inventory[menuActive[1].row][menuActive[1].highlighted] == 0){
            // Put from the item bar into the menu
            menuActive[1].inventory[menuActive[1].row][menuActive[1].highlighted] = player.itemBar[num-1].select;
            player.itemBar[num-1].select = 0;
        } else if (player.itemBar[num-1].select == 0 && menuActive[1].inventory[menuActive[1].row][menuActive[1].highlighted][0] != 0) {
            // Put from the menu into the item bar
            player.itemBar[num-1].select = menuActive[1].inventory[menuActive[1].row][menuActive[1].highlighted]
            menuActive[1].inventory[menuActive[1].row][menuActive[1].highlighted] = 0;
        }
    }
}

function buttonClick(x,y,t,b,r,l){
    return x <= r && x >= l && y <= t && y >= b;
}
function drawMenu(){
    ctx.fillStyle = MENU_MID_BG;
    var tab = 0;
    if(menuActive[1].tabs > 0){
        tab = 1;
    }
    if(menuActive[1].type == "blockMenu"){
    var mWidth = menuActive[1].bSlots*50+12*(menuActive[1].bSlots+1);
    var mHeight = menuActive[1].bRows*50+12*(menuActive[1].bRows+1)+tab*(12+81);
    var xPos = (disp.width-mWidth)/2;
    var yPos = (disp.height-mHeight)/2;
    ctx.fillRect(xPos,yPos,mWidth,mHeight);
    ctx.fillStyle = MENU_DARK_BG;
        for(var i=0;i<menuActive[1].bSlots;i++){
            for(var j=0;j<menuActive[1].bRows;j++){
                if(j*menuActive[1].bSlots+i < BLOCK_SOURCES.length){
                    ctx.fillStyle = MENU_DARK_BG;
                    if(j*menuActive[1].bSlots+i == menuActive[1].highlighted){
                        ctx.fillStyle = MENU_LIGHT_BG;
                    }
                    ctx.fillRect(xPos+12+i*62,yPos+12+j*62,50,50);
                    drawSquare(xPos+12+i*62+7,yPos+12+j*62+7,j*menuActive[1].bSlots+i,2);
                }
            }
        }
        drawTab(menuActive[1].bRows,menuActive[1].bSlots,tab);
    } else if(menuActive[1].type == "tradeMenu"){
        var mWidth = menuActive[1].bSlots*50+12*(menuActive[1].bSlots+1);
        var mHeight = menuActive[1].trades.length*50+12*(menuActive[1].trades.length+1);
        var xPos = (disp.width-mWidth)/2;
        var yPos = (disp.height-mHeight)/2;
        ctx.fillRect(xPos,yPos,mWidth,mHeight);
        for(var i=0;i<menuActive[1].bSlots;i++){
            for(var j=0;j<menuActive[1].trades.length;j++){
                ctx.fillStyle = MENU_DARK_BG;
                if(j*menuActive[1].bSlots+i == menuActive[1].highlighted+menuActive[1].row*menuActive[1].bSlots){
                    ctx.fillStyle = MENU_LIGHT_BG;
                }
                if(i == 2){
                    ctx.drawImage(arrowImg, 0, 0, 36, 36, Math.ceil((xPos+12+i*62+7)*1), Math.ceil((yPos+12+j*62+7)*1), Math.ceil(36*1), Math.ceil(36*1));
                } else{
                    ctx.fillRect(xPos+12+i*62,yPos+12+j*62,50,50);
                    if(i == 1){
                        drawSquare(xPos+12+i*62+7,yPos+12+j*62+7,menuActive[1].trades[j][0][0],menuActive[1].trades[j][0][1]);
                    } else if(i == 3){
                        drawSquare(xPos+12+i*62+7,yPos+12+j*62+7,menuActive[1].trades[j][1][0],menuActive[1].trades[j][1][1]);
                    } else if(i == 0){
                        drawSquare(xPos+12+i*62+7,yPos+12+j*62+7,menuActive[1].trades[j][2][0],menuActive[1].trades[j][2][1]);
                    } else if(i == 4 && menuActive[1].trades[j][2][0] == menuActive[1].trades[j][0][0]){
                        drawSquare(xPos+12+i*62+7,yPos+12+j*62+7,menuActive[1].trades[j][1][0],menuActive[1].trades[j][1][1]);
                    }
                }
            }
        }
    } else if(menuActive[1].type == "storage"){
        var bRows = menuActive[1].inventory.length;
        var bSlots = menuActive[1].inventory[0].length;
        var mWidth = bSlots*50+12*(bSlots+1);
        var mHeight = bRows*50+12*(bRows+1)+tab*(12+81);
        var xPos = (disp.width-mWidth)/2;
        var yPos = (disp.height-mHeight)/2;
        ctx.fillRect(xPos,yPos,mWidth,mHeight);
        ctx.fillStyle = MENU_DARK_BG;
        for(var i=0;i<bSlots;i++){
            for(var j=0;j<bRows;j++){
                ctx.fillStyle = MENU_DARK_BG;
                if(i == menuActive[1].highlighted && j == menuActive[1].row){
                    ctx.fillStyle = MENU_LIGHT_BG;
                }
                ctx.fillRect(xPos+12+i*62,yPos+12+j*62,50,50);
                //remove the 2 at the end by chaning up the data stored in the inventory so you can add things other than just blocks into the storage and stacking up to 99 in one spot
                drawSquare(xPos+12+i*62+7,yPos+12+j*62+7,menuActive[1].inventory[j][i],2);
            }
        }
        drawTab(bRows,bSlots,tab);
    } else if(menuActive[1].type == "itemMenu"){
        var mWidth = menuActive[1].bSlots*50+12*(menuActive[1].bSlots+1);
        var mHeight = menuActive[1].bRows*50+12*(menuActive[1].bRows+1)+tab*(12+81);
        var xPos = (disp.width-mWidth)/2;
        var yPos = (disp.height-mHeight)/2;
        ctx.fillRect(xPos,yPos,mWidth,mHeight);
        ctx.fillStyle = MENU_DARK_BG;
        for(var i=0;i<menuActive[1].bSlots;i++){
            for(var j=0;j<menuActive[1].bRows;j++){
                if(j*menuActive[1].bSlots+i < ITEM_SOURCES.length){
                    ctx.fillStyle = MENU_DARK_BG;
                    if(j*menuActive[1].bSlots+i == menuActive[1].highlighted){
                        ctx.fillStyle = MENU_LIGHT_BG;
                    }
                    ctx.fillRect(xPos+12+i*62,yPos+12+j*62,50,50);
                    drawItem(xPos+12+i*62+7,yPos+12+j*62+7,j*menuActive[1].bSlots+i);
                }
            }
        }
        drawTab(menuActive[1].bRows,menuActive[1].bSlots,tab);
    } else if(menuActive[1].type == "interface"){
        var chars = " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$:.+-";
        var tWidth = interfaceWidth();
        var mWidth = tWidth*20+6;
        var mHeight = menuActive[1].rows.length*36+6-8;
        var xPos = (disp.width-mWidth)/2;
        var yPos = (disp.height-mHeight)/2;
        ctx.fillRect(xPos,yPos,mWidth,mHeight);
        for(var i=0;i<menuActive[1].rows.length;i++){
            var tLen = 0;
            for(var j=0;j<menuActive[1].rows[i].length;j++){
                if(menuActive[1].rows[i][j][0] == 0){
                    for(var l=0;l<menuActive[1].rows[i][j][1].length;l++){
                        for(var t=0;t<chars.length;t++){
                            if(menuActive[1].rows[i][j][1][l] == chars[t]){
                                if(chars[t] != " "){
                                    ctx.drawImage(characters[t],xPos+6+(20*l)+(tLen*20),yPos+6+(36*i));
                                }
                                break;
                            }
                        }
                    }
                } else if(menuActive[1].rows[i][j][0] == 1 || menuActive[1].rows[i][j][0] == 2 || menuActive[1].rows[i][j][0] == 3){
                    ctx.fillStyle = MENU_DARK_BG;
                    if(menuActive[1].select[0] == i && menuActive[1].select[1] == j){
                        ctx.fillStyle = MENU_LIGHT_BG;
                    }
                    var rectWidth = menuActive[1].rows[i][j][1] * 20;
                    ctx.fillRect(xPos+6+(tLen*20),yPos+4+(36*i),rectWidth-2,26);
                    for(var l=0;l<menuActive[1].rows[i][j][2].length;l++){
                        for(var t=0;t<chars.length;t++){
                            if(menuActive[1].rows[i][j][2][l] == chars[t]){
                                if(chars[t] != " "){
                                    ctx.drawImage(characters[t],xPos+6+(20*l)+(tLen*20),yPos+6+(36*i));
                                }
                                break;
                            }
                        }
                    }
                }
                if(menuActive[1].rows[i][j][0] == 0){
                    tLen += menuActive[1].rows[i][j][1].length;
                } else {
                    tLen += menuActive[1].rows[i][j][1];
                }
            }
        }
    } else if(menuActive[1].type == "gui"){
        var gui = menuActive[1];
        // ctx.fillRect()
        // var mWidth = tWidth*20+6;
        // var mHeight = menuActive[1].rows.length*36+6-8;
        var mWidth = gui.width*gui.size;
        var mHeight = gui.height*gui.size;
        var xPos = (disp.width-mWidth)/2;
        var yPos = (disp.height-mHeight)/2;
        ctx.fillRect(xPos,yPos,mWidth,mHeight);
        //
        // var jLeft = Math.floor(gui.offsetX*gui.size / gui.size);
        // var jRight = jLeft + gui.width;
        // var iBottom = yPos - Math.floor(gui.height-gui.offsetY*gui.size / gui.size)-1;
        // var iTop = yPos - Math.ceil((gui.offsetY*gui.size) / gui.size);
        // var jLeft = xPos;
        // var jRight = jLeft + gui.width;
        // var iBottom = yPos;
        // var iTop = iBottom - gui.height;
        var jLeft = gui.offsetX;
        var jRight = jLeft+gui.width;
        var iTop = gui.offsetY;
        var iBottom = iTop+gui.height;
        if (jLeft < 0) {
            jLeft = 0;
        } else if (jLeft >= gui.map[0].length) {
            jLeft = gui.map[0].length - 1;
        };
        if (jRight >= gui.map[0].length) {
            jRight = gui.map[0].length - 1;
        } else if (jRight < 0) {
            jRight = 0;
        };
        if (iBottom < 0) {
            iBottom = 0;
        } else if (iBottom >= gui.map.length) {
            iBottom = gui.map.length - 1;
        };
        if (iTop >= gui.map.length) {
            iTop = gui.map.length - 1;
        } else if (iTop < 0) {
            iTop = 0;
        };
        for (var j = jLeft; j <= jRight; j++) {
            for (var i = iTop; i <= iBottom; i++) {
                var x = Math.floor(xPos + gui.size * j - gui.offsetX*gui.size);
                var y = Math.floor(yPos - gui.offsetY*gui.size + gui.height*gui.size - gui.size * (gui.map.length - i));
                // var y = Math.floor(yPos + (gui.offsetY*gui.size - gui.height*gui.size - gui.size * (gui.map.length - i)));

                // var x = xPos + Math.floor(gui.size*j)
                // if(mapActive == 0){
                    guiSquare(x,y,gui.map[i][j],2);
                // }
            };
        };
    }
}
function getColor(blockId){
    if (blockId < 0 || blockId >= BLOCK_COLORS.length) {
        return "#000000";
    }
    return BLOCK_COLORS[blockId]
}
function guiSquare(x, y, val) {
    if (val != 0) {
        ctx.fillStyle = getColor(val);
        ctx.fillRect(x,y,menuActive[1].size,menuActive[1].size)
    };
};
function drawTab(bRows,bSlots,tab){
    if(tab == 1){
        var mWidth = bSlots*50+12*(bSlots+1);
        var mHeight = bRows*50+12*(bRows+1)+tab*(12+81);
        var xPos = (disp.width-mWidth)/2;
        var yPos = (disp.height-mHeight)/2;
        for(var i=0;i<menuActive[1].tabs;i++){
            if(i != menuActive[1].tabActive-1){
                ctx.fillStyle = MENU_DARK_BG;
                ctx.fillRect(xPos+12+i*92,yPos+12+bRows*62,80,80);
            } else if(i == menuActive[1].tabActive-1){
                ctx.fillStyle = MENU_LIGHT_BG;
                ctx.fillRect(xPos+12+i*92,yPos+12+bRows*62,80,80);
            }
            if(i == 0){
                drawSquare(xPos+12+i*92+22,yPos+12+bRows*62+22,1,2);
            } else if(i == 1){
                drawSword(xPos+12+i*92+32,yPos+12+bRows*62+10,2,1);
            } else if(i == 2){
                drawItem(xPos+12+i*92+22,yPos+12+bRows*62+22,1);
            } else if(i == 3){
                drawSquare(xPos+12+i*92+22,yPos+12+bRows*62+22,37,2);
            }
        }
    }
}
function interfaceWidth(){
    var width = 0;
    for(var i=0;i<menuActive[1].rows.length;i++){
        var tWidth = 0;
        for(var j=0;j<menuActive[1].rows[i].length;j++){
            if(menuActive[1].rows[i][j][0] == 0){
                tWidth += menuActive[1].rows[i][j][1].length;
            } else if(menuActive[1].rows[i][j][0] == 1 || menuActive[1].rows[i][j][0] == 2 || menuActive[1].rows[i][j][0] == 3){
                tWidth += menuActive[1].rows[i][j][1];
            }
        }
        if(tWidth > width){
            width = tWidth;
        }
    }
    return width;
}
function interfaceType(key){
    if(menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][0] == 1 || menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][0] == 2 || menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][0] == 3){
        if(key == "BACKSPACE"){
            if(menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][2].length > 0){
                var newStr = "";
                for(var i=0;i<menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][2].length-1;i++){
                    newStr += menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][2][i];
                }
                menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][2] = newStr
            }
        }
    }
    if(menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][0] == 1){
        var chars = " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$:.-+";
        if(menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][2].length < menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][1]){
            for(var i=0;i<chars.length;i++){
                if(key == chars[i]){
                    menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][2] += key;
                }
            }
        }
    } else if(menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][0] == 2){
        var chars = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if(menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][2].length < menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][1]){
            for(var i=0;i<chars.length;i++){
                if(key == chars[i]){
                    menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][2] += key;
                }
            }
        }
    } else if(menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][0] == 3){
        var chars = "0123456789";
        if(menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][2].length < menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][1]){
            for(var i=0;i<chars.length;i++){
                if(key == chars[i]){
                    menuActive[1].rows[menuActive[1].select[0]][menuActive[1].select[1]][2] += key;
                }
            }
        }
    }

}
function drawMobileControls() {
    var btnWH = disp.width * 0.07;
    var translateY = 2;
    var translateX = 0;
    var btnY = disp.height - btnWH * translateY;
    var btnX = btnWH * translateX;
    ctx.fillStyle = MENU_MOBILE_CONTROLS_BG;
    ctx.fillRect(btnX, btnY, btnWH, btnWH);
}
function overlap(i, j, l, t, r, b) {
    var bt = (36 * (map.length - i))+mapCoord.y;
    var bl = mapCoord.x+j * 36;
    var bb = bt - 36;
    var br = bl + 36;
    return checkOverlaps(t, r, b, l, bt, br, bb, bl);
};
function vehicleOverlap(val,i, j, l, t, r, b) {
    var bt = (36 * (vehicles[val].map.length - i))+vehicles[val].y;
    var bl = vehicles[val].x + j * 36;
    var bb = bt - 36;
    var br = bl + 36;
    return checkOverlaps(t, r, b, l, bt, br, bb, bl);
};
function intersect(arr, l, t, r, b, type) {
    var flag = false;
    var pOnBlock = [];
    if (type[0] == "player") {
        player.inWater = false;
        player.inLeaves = false;
    } else if (type[0] == "entity") {
        entities[type[1]].inWater = false;
        entities[type[1]].inLeaves = false;
    } else if (type[0] == "multiplayer") {
        playersPos[type[1]].piw = false;
        playersPos[type[1]].pil = false;
    }
    for (var i = 0; i < arr.length; i++) {
        var ival = arr[i][0];
        var lval = arr[i][1];
        var val = arr[i][2];
        if (overlap(ival, lval, l, t, r, b)) {
            if(val == 13){
                if (type[0] == "player") {
                    player.inWater = true;
                } else if (type[0] == "entity") {
                    entities[type[1]].inWater = true;
                } else if (type[0] == "multiplayer") {
                    playersPos[type[1]].piw = true;
                }
            } 
            if(val == 29){
                if (type[0] == "player") {
                    player.inLeaves = true;
                } else if (type[0] == "entity") {
                    entities[type[1]].inLeaves = true;
                } else if (type[0] == "multiplayer") {
                    playersPos[type[1]].pil = true;
                }
            }
            if(type[0] == "player" && overlap(ival, lval,l+1,b+1,r-1 ,b-0.1) && isSolid(val)){
                player.jumping = false;
            }
        };
        if(type[0] == "player" && overlap(ival, lval,l+1,b+1,r-1,b-3) && isSolid(val)){
            var alrOn = false;
            for(var ti=0;ti<pOnBlock.length;ti++){
                if(pOnBlock[ti] == val){
                    alrOn = true;
                }
            }
            if(!alrOn){
                pOnBlock.push(val);
            }
        }
        if (isSolid(val) && overlap(ival, lval, l, t, r, b)) {
            if(type[0] == "projectile"){
                projectiles[type[1]].velX = 0;
                projectiles[type[1]].velY = 0;
            }
            flag = true;
        };
    };
    var vehicleAdj = [];
    if(type[0] != "vehicle"){
        vehicleAdj = vehicleAdjacent(l,t,r,b);
    } else {
        if(vehicles[type[1]].velY != 0 || vehicles[type[1]].velX != 0){
            if(type[0] == "vehicle"){
                vehicles[type[1]].inVehicle = -1;
            }
            vehicleAdj = vehicleAdjacentVehicle(l,t,r,b,vehicles[type[1]].velX,vehicles[type[1]].velY,type[1]);
        }
    }
    // var inObject = [];
    if(type[0] == "player"){
        player.inVehicle = -1;
    } else if(type[0] == "entity"){
        entities[type[1]].inVehicle = -1;
    } else if(type[0] == "multiplayer"){
        playersPos[type[1]].inVehicle = -1;
    }
    for(var i=0;i<vehicleAdj.length;i++){
        var vVal = vehicleAdj[i][0];
        var vi = vehicleAdj[i][1];
        var vj = vehicleAdj[i][2];
        // if(type[0] != "vehicle" || (type[0] == "vehicle" && type[1] != vVal)){
            if(vehicleOverlap(vVal,vi,vj,l, t, r, b)){
                if(vehicles[vVal].map[vi][vj] != 0){
                    if(type[0] == "player"){
                        player.inVehicle = vVal;
                    } else if(type[0] == "entity"){
                        entities[type[1]].inVehicle = vVal;
                    } else if(type[0] == "multiplayer"){
                        playersPos[type[1]].inVehicle = vVal;
                    } else if(type[0] == "vehicle"){
                        vehicles[type[1]].inVehicle = vVal;
                    }
                    // inObject.push([vVal,vehicles[vVal].inVehicle]);
                }
                if(vehicles[vVal].map[vi][vj] == 13){
                    if (type[0] == "player") {
                        player.inWater = true;
                    } else if (type[0] == "entity") {
                        entities[type[1]].inWater = true;
                    } else if (type[0] == "multiplayer") {
                        playersPos[type[1]].piw = true;
                    }
                }
                if(vehicles[vVal].map[vi][vj] == 29){
                    if (type[0] == "player") {
                        player.inLeaves = true;
                    } else if (type[0] == "entity") {
                        entities[type[1]].inLeaves = true;
                    } else if (type[0] == "multiplayer") {
                        playersPos[type[1]].pil = true;
                    }
                }
                if(type[0] == "player" && vehicleOverlap(vVal,vi,vj,l+1,b+1,r-1,b-0.1) && isSolid(vehicles[vVal].map[vi][vj])){
                    player.jumping = false;
                }
            }
            if(type[0] != "vehicle" && vehicleOverlap(vVal,vi,vj,l+1,b+1,r-1,b-3) && isSolid(vehicles[vVal].map[vi][vj])){
                if(type[0] == "player"){
                    player.inVehicle = vVal;
                } else if(type[0] == "entity"){
                    entities[type[1]].inVehicle = vVal;
                } else if(type[0] == "multiplayer"){
                    playersPos[type[1]].inVehicle = vVal;
                }
                // var exisiting = false;
                // for(var io=0;io<inObject.length;io++){
                //     if(inObject[io] == vVal){
                //         exisiting = true;
                //     }
                // }
                // if(!exisiting){
                //     inObject.push([vVal,vehicles[vVal].inVehicle]);
                // }
            }
            if(isSolid(vehicles[vVal].map[vi][vj]) && vehicleOverlap(vVal,vi,vj,l, t, r, b)){
                flag = true;
            }
        // }
    }
    // var objSorted = [];
    // if(inObject.length > 0){
        // objSorted.push(inObject[0])
        // var sel = 0;
        // if(inObject.length > 1){
        //     for(var io=1;io<inObject.length;i++){
        //         if(inObject[io])
        //     }
        // }
    //     if(type[0] == "player"){
    //         player.inVehicle = objSorted.length[0];
    //     } else if(type[0] == "entity"){
    //         entities[type[1]].inVehicle = objSorted.length[0];
    //     } else if(type[0] == "multiplayer"){
    //         playersPos[type[1]].inVehicle = objSorted.length[0];
    //     }
    // }
    if(type[0] == "player"){
        player.onBlocks = pOnBlock;
    }
    return flag;
};
function adjacentBlocks(l, t, r, b) {
    var adjacent = [];
    var jl = (l-mapCoord.x) / 36;
    var jr = (r-mapCoord.x) / 36;
    var it = map.length - (t-mapCoord.y) / 36;
    var ib = map.length - (b-mapCoord.y) / 36;
    it = Math.floor(it) - 1;
    ib = Math.ceil(ib);
    jl = Math.floor(jl) - 1;
    jr = Math.ceil(jr);
    for (var i = it; i <= ib; i++) {
        for (var j = jl; j <= jr; j++) {
            if (0 <= i && i < map.length && 0 <= j && j < map[0].length) {
                adjacent.push([i, j, map[i][j][0]]);
            };
        };
    };
    return adjacent;
};
function adjacentBlocksVehicles(l, t, r, b,velX,velY) {
    var adjacent = [];
    var jl = (l-mapCoord.x) / 36;
    var jr = (r-mapCoord.x) / 36;
    var it = map.length - (t-mapCoord.y) / 36;
    var ib = map.length - (b-mapCoord.y) / 36;
    it = Math.floor(it) - 1;
    ib = Math.ceil(ib);
    jl = Math.floor(jl) - 1;
    jr = Math.ceil(jr);
    for(var i=it;i<=ib;i++){
        if (validBlockClick(i,jl+1) && map[i][jl+1][0] != 0 && velX < 0) {
            adjacent.push([i, jl+1, map[i][jl+1][0]]);
        };
        if (validBlockClick(i,jr-1) && map[i][jr-1][0] != 0 && velX > 0) {
            adjacent.push([i, jr-1, map[i][jr-1][0]]);
        };
    }
    for(var j=jl;j<=jr;j++){
        if (validBlockClick(ib-1,j) && map[ib-1][j][0] != 0 && velY < 0) {
            adjacent.push([ib-1, j, map[ib-1][j][0]]);
        };
        if (validBlockClick(it+1,j) && map[it+1][j][0] != 0 && velY > 0) {
            adjacent.push([it+1, j, map[it+1][j][0]]);
        };
    }
    return adjacent;
};
function vehicleAdjacent(l,t,r,b){
    var adjacent = [];
    for(var lj=0;lj<vehicles.length;lj++){
        var jl = (l-vehicles[lj].x) / 36;
        var jr = (r-vehicles[lj].x) / 36;
        var it = vehicles[lj].map.length - (t-vehicles[lj].y) / 36;
        var ib = vehicles[lj].map.length - (b-vehicles[lj].y) / 36;
        it = Math.floor(it) - 1;
        ib = Math.ceil(ib);
        jl = Math.floor(jl) - 1;
        jr = Math.ceil(jr);
        for (var i = it; i <= ib; i++) {
            for (var j = jl; j <= jr; j++) {
                if (0 <= i && i < vehicles[lj].map.length && 0 <= j && j < vehicles[lj].map[0].length) {
                    adjacent.push([lj, i, j, vehicles[lj].map[i][j][0]]);
                };
            };
        };
    }
    return adjacent;
}
function vehicleAdjacentVehicle(l,t,r,b,velX,velY,val){
    var adjacent = [];
    for(var lj=0;lj<vehicles.length;lj++){
        // check if the vehicle is in another vehicke dont check its things
        if(lj != val && vehicles[lj].inVehicle != val){// || vehicles[lj].inVehicle != val){
            var jl = (l-vehicles[lj].x) / 36;
            var jr = (r-vehicles[lj].x) / 36;
            var it = vehicles[lj].map.length - (t-vehicles[lj].y) / 36;
            var ib = vehicles[lj].map.length - (b-vehicles[lj].y) / 36;
            it = Math.floor(it) - 1;
            ib = Math.ceil(ib);
            jl = Math.floor(jl) - 1;
            jr = Math.ceil(jr);
            for(var i=it;i<=ib;i++){
                if (validVehicleBlock(i,jl+1,lj) && vehicles[lj].map[i][jl+1][0] != 0 && velX < 0) {
                    adjacent.push([lj,i, jl+1]);
                };
                if (validVehicleBlock(i,jr-1,lj) && vehicles[lj].map[i][jr-1][0] != 0 && velX > 0) {
                    adjacent.push([lj,i, jr-1]);
                };
            }
            for(var j=jl;j<=jr;j++){
                if (validVehicleBlock(ib-1,j,lj) && vehicles[lj].map[ib-1][j][0] != 0 && velY < 0) {
                    adjacent.push([lj,ib-1, j]);
                };
                if (validVehicleBlock(it+1,j,lj) && vehicles[lj].map[it+1][j][0] != 0 && velY > 0) {
                    adjacent.push([lj,it+1, j]);
                };
            }
        }
    }
    return adjacent;
}
function rayCast(x,y,angle){
    var xDir = (angle > 90 && angle < 270)?-1:1;
    var yDir = (angle > 0 && angle < 180)?1:-1;
    var xDist = (xDir==1)?-1*x%36:36-x%36;
    var yDist = (yDir==1)?-1*y%36:36-y%36;
    var tan = Math.tan(angle*3.1415926535/180);
    var dX = yDist/tan;
    var dY = xDist*tan;
    var ret = [0,0];
    var dec = Math.abs(dX) > Math.abs(xDist);
    if(dec){ 
        ret[0] = xDist+x;
        ret[1] = dY+y;
    } else {
        ret[0] = dX+x;
        ret[1] = yDist+y;
    }
    var thing = dec? [(map.length-Math.floor((y/36))-1),Math.floor((x/36))-xDir]:[(map.length-Math.floor((y/36)-1))+yDir,Math.floor((x/36))];
    if(validBlockClick(thing[0],thing[1]) && !isSolid(map[thing[0]][thing[1]][0])){
        return rayCast(ret[0]-(dec?xDir:0),ret[1]-(dec?0:yDir),angle);
    }
    return ret;
}
function fallDamage(vel,type){
    //var KE = 61/2*(vel*vel);
    if(player.inWater){
        return;
    }else if(vel > 17 || vel < -17){
        if(vel > 17){
            vel -= 17;
        } else if(vel < -17){
            vel *= -1;
            vel -= 17;
        }
        if(vel > 4){
            vel *= 1.6;
        }
        if(vel > 7){
            vel *= 1.6;
        }
        if(type[0] == "player"){
            if (gameOptions.godMode) {
                // No fall damage allowed in god mode
                return;
            }
            player.health -= Math.ceil(vel);
        } else if(type[0] == "entity"){
            entities[type[1]].health -= Math.ceil(vel);
        }
    }
}
function checkOverlaps(t1, r1, b1, l1, t2, r2, b2, l2) {
    // if((((t1 <= t2 && t1 >= b2) || (b1 >= b2 && b1 <= t2)) && (((r1 <= r2 && r1 >= l2) || (l1 >= l2 && l1 <= r2)) || (r1 > r2 && l1 < l2))){
    //     return true;
    // }
    // return false;


    if((((t1 <= t2 && t1 >= b2) || (b1 >= b2 && b1 <= t2)) || (t1 > t2 && b1 < b2)) && (((r1 <= r2 && r1 >= l2) || (l1 >= l2 && l1 <= r2)) || (r1 > r2 && l1 < l2))){
        return true;
    }
    return false;


    // var olx = false;
    // var oly = false;
    // var yCenter = (t2 + b2) / 2;
    // var xCenter = (l2 + r2) / 2;
    // if (l1 <= l2 && l2 <= r1) {
    //     olx = true;
    // };
    // if (l1 <= r2 && r2 <= r1) {
    //     olx = true;
    // };
    // if (t1 >= t2 && t2 >= b1) {
    //     oly = true;
    // };
    // if (t1 >= b2 && b2 >= b1) {
    //     oly = true;
    // };
    // if (l1 <= xCenter && xCenter <= r1) {
    //     olx = true;
    // };
    // if (b1 <= yCenter && yCenter <= t1) {
    //     oly = true;
    // };
    // return olx && oly;
};
setInterval(function () {
    if (gameCharacterActive) {
        for (var i = 0; i < entities.length; i++) {
            entities[i].time -= 1;
            if (entities[i].time <= 0 && entities[i].tracking == false) {
                var cDir = Math.round(Math.random() * (3 - 1) + 1);
                if (cDir == 2 || cDir == 3) {
                    entities[i].time = Math.round(Math.random() * (7 - 2) + 2);
                } else if (cDir == 1) {
                    entities[i].time = Math.round(Math.random() * (2 - 1) + 1);
                }
                entities[i].movingLeft = false;
                entities[i].movingRight = false;
                if (cDir == 2) {
                    entities[i].movingLeft = true;
                } else if (cDir == 3) {
                    entities[i].movingRight = true;
                }
            }
        }
    }
}, 1000);
function entityMovement(i, ejump) {
    if (entities[i].movingRight == false && entities[i].movingLeft == false) {
        entities[i].stop = true;
    } else {
        entities[i].stop = false;
    }
    if (entities[i].pastXpos == entities[i].pl && entities[i].stop == false) {
        entityJump(i, ejump);
    }
    if (entities[i].inWater) {
        entityJump(i, ejump);
    }
    if (entities[i].type == 1) {
        if(entities[i].health > 10){
            if ((entities[i].pr > player.pl) && (entities[i].pr - player.pl < 36 * 12)) {
                if (entities[i].pl == player.pr) {
                    entities[i].movingRight = false;
                    entities[i].movingLeft = false;
                    entities[i].tracking = true;
                } else if(entities[i].pr - player.pl> player.pr - entities[i].pl){
                    entities[i].movingRight = false;
                    entities[i].movingLeft = true;
                    entities[i].tracking = true;
                }
            } if ((entities[i].pl < player.pr) && (player.pr - entities[i].pl < 36 * 12)) {
                if (entities[i].pr == player.pl) {
                    entities[i].movingRight = false;
                    entities[i].movingLeft = false;
                    entities[i].tracking = true;
                } else if(entities[i].pr - player.pl < player.pr - entities[i].pl){
                    entities[i].movingLeft = false;
                    entities[i].movingRight = true;
                    entities[i].tracking = true;
                }
            }
            if ((entities[i].pl - player.pr) > (36 * 15) || (player.pl - entities[i].pr) > (36 * 15)) {
                entities[i].tracking = false;
            }
        } else {
            if (entities[i].pr > player.pl){
                entities[i].movingLeft = false;
                entities[i].movingRight = true;
                entities[i].tracking = true;
            }
            if(entities[i].pl < player.pr){
                entities[i].movingLeft = true;
                entities[i].movingRight = false;
                entities[i].tracking = true;
            }
        }
    }
    if (entities[i].movingRight) {
        entities[i].stop = false;
        entities[i].pastXpos = entities[i].pl
        entities[i].velX += 0.5;
    }
    if (entities[i].movingLeft) {
        entities[i].stop = false;
        entities[i].pastXpos = entities[i].pl
        entities[i].velX -= 0.5;
    }
}
function entityJump(i, eejump) {
    if (entities[i].jumping == false) {
        entities[i].velY += eejump;
        entities[i].jumping = true;
    };
}
function entityLoop() {
    for (var i = 0; i < entities.length; i++) {
        var eadjacent = [];
        if(entities[i].inVehicle == -1){
            eadjacent = adjacentBlocks(entities[i].pl, entities[i].pt, entities[i].pr, entities[i].pb);
        }
        var espeed = 1.15;
        var egravity = 1.1;
        var ejump = 11.8;
        if (entities[i].health <= 0 || entities[i].pb < -360) {
            entities[i].pl = worldSpawnPoint.x,
            entities[i].pr = worldSpawnPoint.x+34,
            entities[i].pt = worldSpawnPoint.y+69,
            entities[i].pb = worldSpawnPoint.y,
            entities[i].jumping = true;
            entities[i].inWater = false;
            entities[i].inLeaves = false;
            entities[i].time = 0;
            entities[i].stop = true;
            entities[i].movingLeft = false;
            entities[i].movingRight = false;
            entities[i].velX = 0;
            entities[i].velY = 0;
            entities[i].pastXpos = 431;
            entities[i].health = 30;
        }
        if (entities[i].inWater) {
            entities[i].jumping = false;
            egravity = 0.16;
            espeed /= 1.8;
            ejump = 0.34;
            if(entities[i].velY > 18){
                entities[i].velY = 18;
            } else if(entities[i].velY < -25){
                entities[i].velY = -25;
            }
        }
        if (entities[i].inLeaves) {
            egravity = 0.9;
            espeed /= 1.6;
            ejump /= 1.65;
        }
        entityMovement(i, ejump);
        var enStep = 12;
        var exStep = entities[i].velX * espeed / enStep;
        var eyStep = entities[i].velY / enStep;
        for (var ecount = 0; ecount < enStep; ecount++) {
            if (!intersect(eadjacent, entities[i].pl + exStep, entities[i].pt + eyStep, entities[i].pr + exStep, entities[i].pb + eyStep, ["entity", i])) {
                entities[i].pl += exStep;
                entities[i].pr += exStep;
                entities[i].pt += eyStep;
                entities[i].pb += eyStep;
            } else if (!intersect(eadjacent, entities[i].pl + exStep, entities[i].pt, entities[i].pr + exStep, entities[i].pb, ["entity", i])) {
                entities[i].pl += exStep;
                entities[i].pr += exStep;
                fallDamage(entities[i].velY,["entity",i]);
                entities[i].velY = 0;
                entities[i].jumping = false;
            } else if (!intersect(eadjacent, entities[i].pl, entities[i].pt + eyStep, entities[i].pr, entities[i].pb + eyStep, ["entity", i])) {
                fallDamage(entities[i].velX,["entity",i]);
                entities[i].velX = 0;
                entities[i].pt += eyStep;
                entities[i].pb += eyStep;
            } else {
                entities[i].velY = 0;
                entities[i].velX = 0;
                break;
            };
        }
        entities[i].velY -= egravity;
        entities[i].velX *= 0.74;
        if(entities[i].inWater){
            entities[i].velY *= 0.9;
        } else {
            entities[i].velY *= 0.979;
        }
    }
}
function multiplayerLoop() {
    for (var i = 0; i < playersPos.length; i++) {
        var eadjacent = adjacentBlocks(playersPos[i].pl, playersPos[i].pt, playersPos[i].pr, playersPos[i].pb);
        var espeed = 1.4;
        var egravity = 1.1;
        var ejump = 11;
        if (playersPos[i].piw) {
            playersPos[i].jmp = false;
            egravity = 0.12;
            espeed /= 1.8;
            ejump = 0.28;
            if(playersPos[i].pyv > 18){
                playersPos[i].pyv = 18;
            } else if(playersPos[i].pyv < -25){
                playersPos[i].pyv = -25;
            }
        }
        if (playersPos[i].pil) {
            egravity = 0.9;
            espeed /= 1.6;
            ejump /=1.65;
        }
        if (playersPos[i].pw) {
            espeed *= 1.7;
            if (playersPos[i].piw) {
                ejump *= 1.4;
            };
        };
        if (playersPos[i].ps) {
            espeed /= 2;
            if (playersPos[i].piw) {
                egravity *= 2.6;
            };
        };
        if (playersPos[i].pspace && playersPos[i].jmp == false) {
            playersPos[i].pyv += ejump;
            playersPos[i].jmp = true;
        };
        if (playersPos[i].pa) {
            playersPos[i].pxv -= 0.5;
        }
        if (playersPos[i].pd) {
            playersPos[i].pxv += 0.5;
        }
        playersPos[i].pyv -= egravity;
        playersPos[i].pxv *= 0.74;
        if(playersPos[i].piw){
            playersPos[i].pyv *= 0.9;
        } else {
            playersPos[i].pyv *= 0.979;
        }
        var enStep = 12;
        var exStep = playersPos[i].pxv * espeed / enStep;
        var eyStep = playersPos[i].pyv / enStep;
        for (var ecount = 0; ecount < enStep; ecount++) {
            if (!intersect(eadjacent, playersPos[i].pl + exStep, playersPos[i].pt + eyStep, playersPos[i].pr + exStep, playersPos[i].pb + eyStep, ["multiplayer", i])) {
                playersPos[i].pl += exStep;
                playersPos[i].pr += exStep;
                playersPos[i].pt += eyStep;
                playersPos[i].pb += eyStep;
            } else if (!intersect(eadjacent, playersPos[i].pl + exStep, playersPos[i].pt, playersPos[i].pr + exStep, playersPos[i].pb, ["multiplayer", i])) {
                playersPos[i].pl += exStep;
                playersPos[i].pr += exStep;
                playersPos[i].pyv = 0;
                playersPos[i].jmp = false;
            } else if (!intersect(eadjacent, playersPos[i].pl, playersPos[i].pt + eyStep, playersPos[i].pr, playersPos[i].pb + eyStep, ["multiplayer", i])) {
                playersPos[i].pxv = 0;
                playersPos[i].pt += eyStep;
                playersPos[i].pb += eyStep;
            } else {
                playersPos[i].pxv = 0;
                playersPos[i].pyv = 0;
                break;
            };
        }
    }
}
function createVehicle(vehMap){
    for(var i=0;i<vehMap.length;i++){
        for(var j=0;j<vehMap[i].length;j++){

        }
    }
}
function entityInVehicle(val,xChange,yChange){
    for(var i=0;i<vehicles.length;i++){
        if(vehicles[i].inVehicle == val){
            vehicles[i].x += xChange;
            vehicles[i].y += yChange;
            //something funky goes on here when too fast going left or up idk
            entityInVehicle(i,xChange,yChange)
        }
    }
    if(player.inVehicle == val){
        // console.log(xChange+" "+yChange)
        gameOffsetX += xChange;
        gameOffsetY += yChange;
        player.pl += xChange;
        player.pr += xChange;
        player.pt += yChange;
        player.pb += yChange;
    }
    for(var i=0;i<entities.length;i++){
        if(entities[i].inVehicle == val){
            entities[i].pl += xChange;
            entities[i].pr += xChange;
            entities[i].pt += yChange;
            entities[i].pb += yChange;
        }
    }
    for(var i=0;i<playersPos.length;i++){
        // console.log(playersPos[i].inVehicle)
        if(playersPos[i].inVehicle == val){
            // console.log(xChange+" "+yChange)
            playersPos[i].pl += xChange;
            playersPos[i].pr += xChange;
            playersPos[i].pt += yChange;
            playersPos[i].pb += yChange;
            // playersPos[i].vehX += xChange;
            // playersPos[i].vehY += yChange;
        }
    }
}
function newAdjBlockVeh(val){
    var vehicle = vehicles[val];
    var vertices = vehicles[val].vertices;
    var velX = vehicle.velX;
    var velY = vehicle.velY;
    var xPos = vehicle.x;
    var yPos = vehicle.y;
    var xDir = -1;
    var yDir = -1;
    if(velX > 0){
        xDir = 1;
    } else if(velX < 0){
        xDir = 3;
    }
    if(velY > 0){
        yDir = 0;
    } else if(velY < 0){
        yDir = 2;
    }
    var ret = [[],[],[],[]];
    for(var i=0;i<vertices.length;i++){
        // ret[i] = new var[vertices[i].length][][];
        if(xDir == i || yDir == i){
            for(var j=0;j<vertices[i].length;j++){
                ret[i][j] = getSideAdj(i, vertices[i][j][0], vertices[i][j][1], vertices[i][j][2], xPos, yPos);
            }
        }
    }
    // console.log(ret[0].length);
    return ret;

}
function getSideAdj(dir, yPos, xPos, lenPos, xVal, yVal){
    var adj = [];
    const plus = [0,0,-1,1];
    const pSet = [1,0,0,-1];
    const core = [36,36,0,0];
    if(dir == 1 || dir == 3){
        var y = Math.floor((map.length -((yVal+(yPos*36)+core[0])/36))+pSet[0])-1;
        var x = Math.floor(((xVal+(xPos*36)+core[dir]) / 36)+pSet[dir]);
        var len = Math.floor((map.length-((yVal+(lenPos*36)+core[2])/36))+pSet[2]);
        for(var i=y;i<=len;i++){
            if (validBlockClick(i,x+plus[dir]) && map[i][x+plus[dir]][0] != 0) {
                adj.push([i,x+plus[dir],map[i][x+plus[dir]][0]]);
                // map[i][x+plus[dir]][1] = -5;
            }
        }
    } else {
        var y = map.length - Math.floor(((yVal+(yPos*36)+core[dir])/36)+pSet[dir]);
        var x = Math.floor(((xVal+(xPos*36)+core[3]) / 36)+pSet[3]);
        var len = Math.floor(((xVal+(lenPos*36)+core[1]) / 36)+pSet[1]);
        for(var j=x;j<=len;j++){
            if (validBlockClick(y+plus[dir],j) && map[y+plus[dir]][j][0] != 0) {
                adj.push([y+plus[dir],j,map[y+plus[dir]][j][0]]);
                // map[y+plus[dir]][j][1] = -5;
            }
        }
    }
    // var adjacent = new var[adj.size()][3];
    // for(var i=0;i<adj.size();i++){
    //     adjacent[i] = adj.get(i);
    // }
    return adj;
}

function verticeOverlap(dir, y, x, len, t, r, b, l){
    if(dir == 1 || dir == 3){
        if((x >= l && x <= r) && (((y <= t && y >= b) || (len <= t && y >= b)) || (y > t && len < b))){
            return true;
        }
    } else {
        if((y >= b && y <= t) && (((x >= l && x <= r) || (len <= l && len >= r)) || (x < l && len > r))){
            return true;
        }
    }
    return false;
}

function overlapVeh(i,j, dir, y, x, len){
    var bt = 36 * (map.length - i);
    var bl = j * 36;
    var bb = bt - 36;
    var br = bl + 36;
    return verticeOverlap(dir, y, x, len, bt, br, bb, bl);
}

function vehIntersect(arr, dir, y, x, len, veh){
    var vehicle = vehicles[veh];
    var flag = false;
    for (var i = 0; i < arr.length; i++) {
        var ival = arr[i][0];
        var lval = arr[i][1];
        var val = arr[i][2];
        var overlaps = overlapVeh(ival, lval, dir, y, x, len);
        if (overlaps) {
            if(val == 13){
                vehicle.inWater = true;
            }
            if(val == 29){
                
            }
        };
        if (isSolid(val) && overlaps) {
            flag = true;
        };
    };
    
    return flag;
}
function vehicleLoop(){
    for(var i=0;i<vehicles.length;i++){
        var exspeed = 0.257*vehicles[i].xSpeed;
        var eyspeed = 0.257*vehicles[i].ySpeed;
        if (vehicles[i].inWater) {
            // gravity = 0.12;
            exspeed /= 3.8;
            eyspeed /= 3.8;

            // jump = 0.28;
            if(vehicles[i].velX > 10){
                vehicles[i].velX = 10;
            } else if(vehicles[i].velX < -10){
                vehicles[i].velX = -10;
            }
            if(vehicles[i].velY > 10){
                vehicles[i].velY = 10;
            } else if(vehicles[i].velY < -10){
                vehicles[i].velY = -10;
            }
        }
        // var egravity = 1.1;
        if(vehicles[i].movingRight){
            vehicles[i].velX += exspeed;
        }
        if(vehicles[i].movingLeft){
            vehicles[i].velX -= exspeed;
        }
        if(vehicles[i].movingUp){
            vehicles[i].velY += eyspeed;
        }
        if(vehicles[i].movingDown){
            vehicles[i].velY -= eyspeed;
        }
        vehicles[i].velX *= 0.9;
        vehicles[i].velY *= 0.9;
        if((vehicles[i].velY > 0 && vehicles[i].velY < 0.0005) || (vehicles[i].velY > -0.0005 && vehicles[i].velY < 0)){
            vehicles[i].velY = 0;
        }
        if((vehicles[i].velX > 0 && vehicles[i].velX < 0.0005) || (vehicles[i].velX > -0.0005 && vehicles[i].velX < 0)){
            vehicles[i].velX = 0;
        }
        var eadjacent = [];
        if(vehicles[i].inVehicle == -1 || (vehicles[i].inVehicle != -1 && (vehicles[i].velX == 0 && vehicles[i].velY == 0))){
            eadjacent = newAdjBlockVeh(i);
        }
        var enStep = 15;
        var exStep = vehicles[i].velX / enStep;
        var eyStep = vehicles[i].velY / enStep;
        var vehicle = vehicles[i];
        var vertices = vehicles[i].vertices;
        var velX = vehicle.velX;
        var velY = vehicle.velY;
        var xPos = vehicle.x;
        var yPos = vehicle.y;
        const core = [36,36,0,0];
        var xDir = -1;
        var yDir = -1;
        if(velX > 0){
            xDir = 1;
        } else if(velX < 0){
            xDir = 3;
        }
        if(velY > 0){
            yDir = 0;
        } else if(velY < 0){
            yDir = 2;
        }
        var yCol = false;
        var xCol = false;
        vehicle.inWater = false;
        if(vehicles[i].velX != 0 || vehicles[i].velY != 0){
            for (var ecount = 0; ecount < enStep; ecount++) {
                if(xDir != -1){
                    for(var h =0;h<vertices[xDir].length;h++){
                        var y = yPos+(vertices[xDir][h][0]*36)+core[0];
                        var x = xPos+(vertices[xDir][h][1]*36)+core[xDir];
                        var len = yPos+(vertices[xDir][h][2]*36)+core[0];
                        var sadjacent = eadjacent[xDir][h];
                        if(vehIntersect(sadjacent,xDir,y+eyStep,x+exStep,len+eyStep,i)){
                            xCol = true;
                            
                        }
                    }
                }
                if(yDir != -1){
                    for(var h =0;h<vertices[yDir].length;h++){
                        var y = yPos+(vertices[yDir][h][0]*36)+core[yDir];
                        var x = xPos+(vertices[yDir][h][1]*36)+core[3];
                        var len = xPos+(vertices[yDir][h][2]*36)+core[1];
                        var sadjacent = eadjacent[yDir][h];
                        if(vehIntersect(sadjacent,yDir,y+eyStep,x+exStep,len+exStep,i)){
                            yCol = true;
                        }
                    }
                }
                if(xCol && yCol){
                    vehicles[i].velX = 0;
                    vehicles[i].velY = 0;
                } else {
                    if(!xCol){
                        // entityInVehicle(i,exStep,eyStep);
                        vehicles[i].x += exStep;
                        entityInVehicle(i,exStep,0);

                        if(yCol){
                            vehicles[i].velY = 0;
                        }
                    }
                    if(!yCol){
                        if(xCol){
                            vehicles[i].velX = 0;
                        }
                        vehicles[i].y += eyStep;
                        entityInVehicle(i,0,eyStep);
                    }
                }
            }
        }
    }
}
// function vehicleLoop(){
//     for(var i=0;i<vehicles.length;i++){
//         var exspeed = 0.257*vehicles[i].xSpeed;
//         var eyspeed = 0.257*vehicles[i].ySpeed;
//         var egravity = 1.1;
//         if(vehicles[i].movingRight){
//             vehicles[i].velX += exspeed;
//         }
//         if(vehicles[i].movingLeft){
//             vehicles[i].velX -= exspeed;
//         }
//         if(vehicles[i].movingUp){
//             vehicles[i].velY += eyspeed;
//         }
//         if(vehicles[i].movingDown){
//             vehicles[i].velY -= eyspeed;
//         }
//         var vr = vehicles[i].x+(36*vehicles[i].map[0].length);
//         var vl = vehicles[i].x;
//         var vt = vehicles[i].y+(36*vehicles[i].map.length);
//         var vb = vehicles[i].y;
//         vehicles[i].velX *= 0.9;
//         vehicles[i].velY *= 0.9;
//         if((vehicles[i].velY > 0 && vehicles[i].velY < 0.0005) || (vehicles[i].velY > -0.0005 && vehicles[i].velY < 0)){
//             vehicles[i].velY = 0;
//         }
//         if((vehicles[i].velX > 0 && vehicles[i].velX < 0.0005) || (vehicles[i].velX > -0.0005 && vehicles[i].velX < 0)){
//             vehicles[i].velX = 0;
//         }
//         var eadjacent = [];
//         if(vehicles[i].inVehicle == -1 || (vehicles[i].inVehicle != -1 && (vehicles[i].velX == 0 && vehicles[i].velY == 0))){
//             eadjacent = adjacentBlocksVehicles(vl, vt, vr, vb,vehicles[i].velX,vehicles[i].velY);
//         }
//         var enStep = 10;
//         var exStep = vehicles[i].velX / enStep;
//         var eyStep = vehicles[i].velY / enStep;
//         // create an inVehicle function to check if any form of entity is in the vehicle, and if it is
//         if(vehicles[i].velX != 0 || vehicles[i].velY != 0){
//             for (var ecount = 0; ecount < enStep; ecount++) {
//                 if (!intersect(eadjacent, vl + exStep, vt + eyStep, vr + exStep, vb + eyStep, ["vehicle", i])) {
//                     entityInVehicle(i,exStep,eyStep);
//                     vehicles[i].x += exStep;
//                     vehicles[i].y += eyStep;
//                 } else if (!intersect(eadjacent, vl + exStep, vt, vr + exStep, vb, ["vehicle", i])) {
//                     entityInVehicle(i,exStep,0);
//                     vehicles[i].x += exStep;
//                     vehicles[i].velY = 0;
//                 } else if (!intersect(eadjacent, vl, vt + eyStep, vr, vb + eyStep, ["vehicle", i])) {
//                     vehicles[i].velX = 0;
//                     entityInVehicle(i,0,eyStep);
//                     vehicles[i].y += eyStep;
//                 } else {
//                     vehicles[i].velX = 0;
//                     vehicles[i].velY = 0;
//                     break;
//                 };
//             }
//         }
//     }
// }

function particleLoop(){
    for(var i=0;i<particles.length;i++){
        
    }
}
function projectileLoop(){
    for (var i = 0; i < projectiles.length; i++) {
        var eadjacent = adjacentBlocks(projectiles[i].pl, projectiles[i].pt, projectiles[i].pr, projectiles[i].pb);
        var espeed = 30;
        var egravity = 0.03;
        if(projectiles[i].pb < -500){
            removeProjectile(projectiles[i].id);
            break;
        }
        if(!projectiles[i].stop[1] && projectiles[i].pb > -500){
            var enStep = 16;
            var exStep = projectiles[i].velX * espeed / enStep;
            var eyStep = projectiles[i].velY * espeed / enStep;
            for (var ecount = 0; ecount < enStep; ecount++) {
                if (!intersect(eadjacent, projectiles[i].pl + exStep, projectiles[i].pt + eyStep, projectiles[i].pr + exStep, projectiles[i].pb + eyStep, ["projectile", i])) {
                    projectiles[i].pl += exStep;
                    projectiles[i].pr += exStep;
                    projectiles[i].pt += eyStep;
                    projectiles[i].pb += eyStep;
                } else if (!intersect(eadjacent, projectiles[i].pl + exStep, projectiles[i].pt, projectiles[i].pr + exStep, projectiles[i].pb, ["projectile", i])) {
                    projectiles[i].pl += exStep;
                    projectiles[i].pr += exStep;
                    projectiles[i].velY = 0;
                } else if (!intersect(eadjacent, projectiles[i].pl, projectiles[i].pt + eyStep, projectiles[i].pr, projectiles[i].pb + eyStep, ["projectile", i])) {
                    projectiles[i].velX = 0;
                    projectiles[i].pt += eyStep;
                    projectiles[i].pb += eyStep;
                } else {
                    projectiles[i].velY = 0;
                    break;
                };
            }
            if(projectiles[i].type == "boom" || projectiles[i].type == "item"){
                projectiles[i].velY -= egravity;
            }
            if(projectiles[i].stop[0] == false && projectiles[i].velX < 0.04 && projectiles[i].velY < 0.04 && projectiles[i].velX > -0.04 && projectiles[i].velY > -0.04){
                projectiles[i].stop[0] = true;
                setTimeout(checkProjDead,500,i,projectiles[i].id);
            }
        }
    }
}
function checkProjDead(i,id){
    if(projectiles[i] != null && projectiles[i].id == id){
        projectiles[i].stop[1] = projectiles[i].velX < 0.04 && projectiles[i].velY < 0.04 && projectiles[i].velX > -0.04 && projectiles[i].velY > -0.04;
        projectiles[i].stop[0] = false;
    }
}
var tools = [[10,"metal",[["wood",6]]],[11,"metal",[["stone",5]]],[12,"metal",[["stone",8]]],[13,"metal",[["grain",4]]],[14,"metal",[["wood",6]]]];
function isTool(){
    var clickAction = player.itemBar[player.selected].clickAction;
    var select = player.itemBar[player.selected].select;
    if(clickAction == 0){
        for(var i=0;i<tools.length;i++){
            if(select == tools[i][0]){
                return tools[i];
            }
        }
    }
    return -1;
}
function getCurrent(){
    return current;
}
function useControls(){
    var speed = 1.4;
    // var gravity = (9.8*36)/((60/1)*(60/1))*(60/60);
    // var jump = 7.4*(60/60);
    var gravity = 1.1;
    var jump = 11; 
    var adjacent = [];
    var willRespawn = false;
    if(player.inVehicle == -1){
        adjacent = adjacentBlocks(player.pl, player.pt, player.pr, player.pb);
    }
    if (player.inWater) {
        player.jumping = false;
        gravity = 0.12;
        speed /= 1.8;
        jump = 0.28;
        if(player.velY > 18){
            player.velY = 18;
        } else if(player.velY < -25){
            player.velY = -25;
        }
    }
    if (player.inLeaves) {
        gravity = 0.9;
        speed /= 1.6;
        jump /=1.65;
    }
    // var scrollBackgroundX = false;
    // var scrollBackgroundY = false;
    if(!menuActive[0]){
        if (controls.keys[3][1]) {
            if (gameOptions.godMode == 1) {
                speed *= 3.3;
            } else {
                speed *= 1.7;
            }
            if (player.inWater) {
                jump *= 1.4;
            };
        };
        if (controls.keys[4][1]) {
            speed /= 2;
            if (player.inWater) {
                gravity *= 2.6;
            };
        };
        if (controls.keys[0][1] && (player.jumping == false || gameOptions.godMode == 1)) {
            // Jump
            player.velY += jump;
            player.jumping = true;
            player.velY = Math.min(player.velY, 20);
        };
        if (controls.keys[1][1]) {
            player.velX -= 0.5;
        };
        if (controls.keys[2][1]) {
            player.velX += 0.5;
        };
        if (controls.keys[5][1]){
            controls.keys[5][1] = false;
            dropItem();
        }
        if (controls.keys[6][1]) {
            controls.keys[6][1] = false;
            willRespawn = true;
        };
        if (controls.keys[14][1] && controls.keys[15][1]) {
            controls.keys[14][1] = false;
            controls.keys[15][1] = false;
            saveGame();
        }
    } else if(menuActive[0] && menuActive[1].purpose == "vehicle"){
        // menuActive[1]
        if(player.inVehicle != -1){
            menuActive[1].rows[0][1][1] = ""+Math.floor(vehicles[menuActive[1].isVehicle].velX);
            menuActive[1].rows[1][1][1] = ""+Math.floor(vehicles[menuActive[1].isVehicle].velY);
            menuActive[1].rows[2][1][1] = ""+Math.floor(vehicles[menuActive[1].isVehicle].x/36);
            menuActive[1].rows[3][1][1] = ""+Math.floor(vehicles[menuActive[1].isVehicle].y/36);
            var cruiseC = "OFF";
            if(vehicles[menuActive[1].isVehicle].cruise){
                cruiseC = "ON";
            }
            menuActive[1].rows[4][1][1] = cruiseC;
            if (controls.keys[3][1]) {
                vehicles[menuActive[1].isVehicle].movingUp = true;
            } else if(!vehicles[menuActive[1].isVehicle].cruise){
                vehicles[menuActive[1].isVehicle].movingUp = false;
            }
            if (controls.keys[4][1]) {
                vehicles[menuActive[1].isVehicle].movingDown = true;
            } else if(!vehicles[menuActive[1].isVehicle].cruise){
                vehicles[menuActive[1].isVehicle].movingDown = false;
            }
            if (controls.keys[1][1]) {
                vehicles[menuActive[1].isVehicle].movingLeft = true;
            } else if(!vehicles[menuActive[1].isVehicle].cruise){
                vehicles[menuActive[1].isVehicle].movingLeft = false;
            }
            if (controls.keys[2][1]) {
                vehicles[menuActive[1].isVehicle].movingRight = true;
            } else if(!vehicles[menuActive[1].isVehicle].cruise){
                vehicles[menuActive[1].isVehicle].movingRight = false;
            }
            // console.log(controls.keys[16][1]);
            if(controls.keys[16][1]){
                controls.keys[16][1] = false;
                if(vehicles[menuActive[1].isVehicle].cruise){
                    vehicles[menuActive[1].isVehicle].cruise = false;
                } else {
                    vehicles[menuActive[1].isVehicle].cruise = true;
                }
            }
        }
    } else if(menuActive[0] && menuActive[1].type == "gui"){
        if (controls.keys[3][1]) {
            menuActive[1].offsetY += 1;
            controls.keys[3][1] = false;
            // vehicles[menuActive[1].isVehicle].movingUp = true;
        }
        if (controls.keys[4][1]) {
            menuActive[1].offsetY -= 1;
            controls.keys[4][1] = false;
            // vehicles[menuActive[1].isVehicle].movingDown = true;
        }
        if (controls.keys[1][1]) {
            menuActive[1].offsetX += 1;
            controls.keys[1][1] = false;
            // vehicles[menuActive[1].isVehicle].movingLeft = true;
        }
        if (controls.keys[2][1]) {
            menuActive[1].offsetX -= 1;
            controls.keys[2][1] = false;
            // vehicles[menuActive[1].isVehicle].movingRight = true;
        }
    }

    // Legacy comment: floor is lava code
    //
    // for(var f=0;f<player.onBlocks.length;f++){
    //     if(player.onBlocks[f] == 1 || player.onBlocks[f] == 4){
    //         respawn();
    //     }
    // }

    if (controls.keys[7][1]) {
        controls.keys[7][1] = false;
        if(menuActive[0]){
            if(menuActive[1].purpose == "vehicle" && player.inVehicle != -1  && !vehicles[menuActive[1].isVehicle].cruise){
                vehicles[menuActive[1].isVehicle].movingUp = false;
                vehicles[menuActive[1].isVehicle].movingDown = false;
                vehicles[menuActive[1].isVehicle].movingLeft = false;
                vehicles[menuActive[1].isVehicle].movingRight = false;
                if(multiplayer){
                    ws.send(`unMountVehicle|${menuActive[1].isVehicle}|${vehicles[menuActive[1].isVehicle].id}|${sid}`);
                }
            } else if(menuActive[1].purpose == "vehicleSpeed" && player.inVehicle != -1){
                var xVal = 1;
                var yVal = 1;
                if(menuActive[1].rows[2][1][2] != ""){
                    if(parseInt(menuActive[1].rows[2][1][2],10) > vehicles[menuActive[1].isVehicle].maxXspeed){
                        xVal = vehicles[menuActive[1].isVehicle].maxXspeed;
                    } else if(parseInt(menuActive[1].rows[2][1][2],10) <= 0){
                        xVal = 0;
                    } else {
                        xVal = parseInt(menuActive[1].rows[2][1][2],10);
                    }
                }
                if(menuActive[1].rows[5][1][2] != ""){
                    if(parseInt(menuActive[1].rows[5][1][2],10) > vehicles[menuActive[1].isVehicle].maxYspeed){
                        yVal = vehicles[menuActive[1].isVehicle].maxYspeed;
                    } else if(parseInt(menuActive[1].rows[5][1][2],10) <= 0){
                        yVal = 1;
                    } else {
                        yVal = parseInt(menuActive[1].rows[5][1][2],10);
                    }
                }
                vehicles[menuActive[1].isVehicle].xSpeed = xVal;
                vehicles[menuActive[1].isVehicle].ySpeed = yVal;
            }
            menuActive[0] = false;
        } else {
            menuData.block.tabActive = 1;
            menuActive[1] = menuData.block;
            menuActive[0] = true;
        }
    }
    changeClick();
    if(controls.click[0] && canHoldClick){
        canHoldClick = false;
        setTimeout(function(){
            canHoldClick = true;
        },300);
        var placeBlock = true;
        var rect = disp.getBoundingClientRect();
        var xPos = controls.click[1]-rect.left+((gameOffsetX-mapCoord.x)*renderSize);
        var yPos = controls.click[2]-rect.top-((gameOffsetY-mapCoord.y)*renderSize);
        var blockX = Math.floor(xPos / (36*renderSize));
        var blockY = Math.floor((yPos - (disp.height*renderSize)) / (36*renderSize)) + map.length;
        var xPo = controls.click[1]-rect.left;
        var yPo = disp.height - controls.click[2];
        if(menuActive[0]){
            menuActive[1].mouseX = xPo;
            menuActive[1].mouseY = yPo;
            clickBtn();
        } else {
            for(var i=0;i<entities.length;i++){
                if(entities[i].type == 2 && buttonClick(xPo,yPo,entities[i].pt-gameOffsetY,entities[i].pb-gameOffsetY,entities[i].pr-gameOffsetX,entities[i].pl-gameOffsetX)){
                    menuActive[1] = entities[i].traderMenu;
                    menuActive[0] = true;
                    placeBlock = false;
                }
            }
            for(var i=0;i<projectiles.length;i++){
                if(buttonClick(xPo,yPo,projectiles[i].pt-gameOffsetY,projectiles[i].pb-gameOffsetY,projectiles[i].pr-gameOffsetX,projectiles[i].pl-gameOffsetX)){
                    placeBlock = false;
                    var del = false;
                    if(projectiles[i].type == "item"){
                        var id = projectiles[i].id;
                        if(player.itemBar[player.selected].select == 0){
                            player.itemBar[player.selected].select = projectiles[i].select;
                            player.itemBar[player.selected].clickAction = projectiles[i].clickAction;
                            removeProjectile(projectiles[i].id);
                            del = true;
                        } else if(player.itemBar[player.selected].amount != true && player.itemBar[player.selected].select == projectiles[i].select && player.itemBar[player.selected].clickAction == projectiles[i].clickAction && player.itemBar[player.selected].amount < 99){
                            player.itemBar[player.selected].amount += 1;
                            removeProjectile(projectiles[i].id);
                            del = true;
                        }
                        if(multiplayer && del){
                            ws.send(`delProj|${id}|${sid}`);
                        }
                        if(!del){
                            placeBlock = true;
                        }
                    }
                }
            }
            for(var i=0;i<vehicles.length;i++){
                var vehXpos = controls.click[1]-rect.left+(gameOffsetX-vehicles[i].x)*renderSize;
                var vehYpos = controls.click[2]-rect.top-(gameOffsetY-vehicles[i].y)*renderSize;
                var vehBlockX = Math.floor(vehXpos / (36*renderSize));
                var vehBlockY = Math.floor((vehYpos - (disp.height*renderSize)) / (36*renderSize)) + vehicles[i].map.length;
                if(validVehicleBlock(vehBlockY,vehBlockX,i)){
                    if(vehicles[i].map[vehBlockY][vehBlockX] == 46){
                        if(multiplayer){
                            if(player.inVehicle != -1){
                                ws.send(`mountVehicle|${i}|${vehicles[i].id}|${sid}`);
                            }
                        } else {
                            menuActive[1] = vehicleInterface.controls;
                            menuActive[1].isVehicle = i;
                            if(player.inVehicle != -1){
                                menuActive[1].rows[0][1][1] = ""+Math.floor(vehicles[menuActive[1].isVehicle].velX);
                                menuActive[1].rows[1][1][1] = ""+Math.floor(vehicles[menuActive[1].isVehicle].velY);
                                menuActive[1].rows[2][1][1] = ""+Math.floor(vehicles[menuActive[1].isVehicle].x/36);
                                menuActive[1].rows[3][1][1] = ""+Math.floor(vehicles[menuActive[1].isVehicle].y/36);
                                var cruiseC = "OFF";
                                if(vehicles[menuActive[1].isVehicle].cruise){
                                    cruiseC = "ON";
                                }
                                menuActive[1].rows[3][1][1] = cruiseC;

                            } else {
                                menuActive[1].rows[0][1][1] = "";
                                menuActive[1].rows[1][1][1] = "";
                                menuActive[1].rows[2][1][1] = "";
                                menuActive[1].rows[3][1][1] = "";
                                menuActive[1].rows[4][1][1] = "";
                            }
                            menuActive[0] = true;
                        }
                    } else if(vehicles[i].map[vehBlockY][vehBlockX] == 47){
                        if(player.inVehicle != -1){
                            vehicleInterface.speedModifier.rows[0][1][1] = ""+vehicles[i].maxXspeed;
                            vehicleInterface.speedModifier.rows[1][1][1] = ""+vehicles[i].xSpeed;
                            vehicleInterface.speedModifier.rows[3][1][1] = ""+vehicles[i].maxYspeed;
                            vehicleInterface.speedModifier.rows[4][1][1] = ""+vehicles[i].ySpeed;
                        } else {
                            vehicleInterface.speedModifier.rows[0][1][1] = "";
                            vehicleInterface.speedModifier.rows[1][1][1] = "";
                            vehicleInterface.speedModifier.rows[3][1][1] = "";
                            vehicleInterface.speedModifier.rows[4][1][1] = "";
                        }
                        menuActive[1] = vehicleInterface.speedModifier;
                        menuActive[1].isVehicle = i;
                        menuActive[0] = true;
                    }
                    if(vehicles[i].map[vehBlockY][vehBlockX] != 0){
                        placeBlock = false;
                    }
                }
            }
            // Check for interactive blocks
            if (
                validBlockClick(blockY,blockX)
                && player.itemBar[player.selected].select == 0
                /*&& player.itemBar[player.selected].clickAction == 0*/
            ) {
                var val = map[blockY][blockX];
                if(val[0] == 37){
                    // Storage block
                    menuActive[1] = map[blockY][blockX][2];
                    menuActive[0] = true;
                    placeBlock = false;
                } else if(val[0] == 41 && val[2] > 0){
                    menuActive[1] = map[blockY][blockX][3];
                    menuActive[0] = true;
                    placeBlock = false;
                } else if(val[0] == 43 && val[2] > 0){

                }
            }
            // Place/dig if not already interacted with something
            if (
                validBlockClick(blockY,blockX)
                && player.itemBar[player.selected].clickAction != null
                && placeBlock
            ) {
                var dmgVal = 1;
                var tool = isTool();
                if ((player.itemBar[player.selected].clickAction == 2 || tool != -1) && validBlockClick(blockY,blockX)) {
                    if (map.length - 1 >= blockY && blockY >= 0) {
                        if (map[blockY].length - 1 >= blockX && blockX >= 0) {
                            var place = player.itemBar[player.selected].select;
                            if(tool != -1){
                                place = 0;
                                if(map[blockY][blockX][map[blockY][blockX].length-1] == "brittle" && tool[1] == "metal"){
                                    dmgVal = 3;
                                }
                                if(map[blockY][blockX][map[blockY][blockX].length-1] == tool[2][0][0]){
                                    dmgVal = tool[2][0][1]
                                }
                            }
                            if(map[blockY][blockX][1] == false || map[blockY][blockX][1] - dmgVal <= 0){
                                if(!blockMultiCheck(blockY,blockX) || !isSolid(place)){
                                    var prevBlock = map[blockY][blockX];
                                    setWorldBlockToId(blockY,blockX,place);
                                    if(multiplayer){
                                        ws.send(`build|${blockY}|${blockX}|${place}|${sid}`);
                                    }
                                    if(activeEnBlock(place) != 0 && activeEnBlock(prevBlock[0]) == 1){
                                        energyRemoveT(blockX,blockY,blockSelect,prevBlock[2]);
                                    }
                                    if(activeEnBlock(place) != -1){
                                        energyPlace(blockX,blockY,place);
                                    }
                                    // createItem(prevBlock[0],2,(map.length-blockY)*36-36,blockX*36+((36-24)/2),0,0);
                                }
                            } else {
                                map[blockY][blockX][1] -= dmgVal;
                            }
                        };
                    }
                }
            }
        }
    }
    if (window.innerHeight < 400) {
        disp.height = 400;
    } else {
        disp.height = window.innerHeight;
    };
    if (window.innerWidth < 200) {
        disp.width = 200;
    } else {
        disp.width = window.innerWidth;
    };
    // var Fg = player.mass*gravity;
    // var Fd = (0.7*(2/9)*0.5*1.225*(player.velY*player.velY));
    // var Vel2 = (Fd*2)/(1.225*0.7*(2/9));
    // var VelF = Math.sqrt(Vel2);
    // console.log(Fd)
    // player.velY *= VelF;
    // player.velY -= ((player.mass*gravity/60))//-(Fd/60));
    // var Fd = 0.7*(2/9)*0.5*1.225*(player.velY*player.velY);
    // player.velY -= Fd
    player.velY -= gravity;
    player.velX *= 0.74;
    // player.velY *= -1.1
    if(player.inWater){
        player.velY *= 0.9;
    } else {
        player.velY *= 0.979;
    }
    var nStep = 16;
    var xStep = player.velX * speed / nStep;
    var yStep = player.velY / nStep;
    //!!!IMPORTANT!!!
    //get this to work with renderSize and fix the issue where the blocks dont take up the whole screen when render size increases or decreases
    //!!!IMPORTANT!!!
    // if (player.pt - gameOffsetY >= 0.75 * disp.height*renderSize && player.pt + yStep > player.pt) {
    //     scrollBackgroundY = true;
    // };
    // if (player.pb - gameOffsetY <= 0.16 * disp.height && player.pb + yStep < player.pb) {
    //     scrollBackgroundY = true;
    // };
    // if (player.pr - gameOffsetX >= 0.9 * disp.width && player.pr + xStep > player.pr) {
    //     scrollBackgroundX = true;
    // };
    // if (player.pl - gameOffsetX <= 0.1 * disp.width && player.pl + xStep < player.pl) {
    //     scrollBackgroundX = true;
    // };
    for (var count = 0; count < nStep; count++) {
        if (!intersect(adjacent, player.pl + xStep, player.pt + yStep, player.pr + xStep, player.pb + yStep, ["player", 0])) {
            // if (scrollBackgroundX) {
            //     gameOffsetX += xStep;
            // }
            // if (scrollBackgroundY) {
            //     gameOffsetY += yStep;
            // }
            player.pl += xStep;
            player.pr += xStep;
            player.pt += yStep;
            player.pb += yStep;
        } else if (!intersect(adjacent, player.pl + xStep, player.pt, player.pr + xStep, player.pb, ["player", 1])) {
            // if (scrollBackgroundX) {
            //     gameOffsetX += xStep;
            // };
            player.pl += xStep;
            player.pr += xStep;
            fallDamage(player.velY,["player"]);
            player.velY = 0;
        }
        else if (!intersect(adjacent, player.pl, player.pt + yStep, player.pr, player.pb + yStep, ["player", 0])) {
            // if (scrollBackgroundY) {
            //     gameOffsetY += yStep
            // };
            fallDamage(player.velX,["player"]);
            player.velX = 0;
            player.pt += yStep;
            player.pb += yStep;
        }
        else {
            player.velY = 0;
            player.velX = 0;
            break;
        };
    };
    // console.log(player.velY*speed/36*60*2.23694)
    if(player.health <= 0 || player.pb < -360 || willRespawn){
        respawn();
        if(multiplayer){
            ws.send(`respawn|${sid}`);
        }
    }
    vehicleLoop();
    entityLoop();
    projectileLoop();
    if(multiplayer){
        multiplayerLoop();
    }
}

function renderFrame() {
    useControls();
    // gameOffsetX = (player.pr-17 - disp.width/2)*0.06 + gameOffsetX*0.94;
    // gameOffsetY = (player.pt - disp.height/2)*0.015 + gameOffsetY*0.985;
    var crx = 0.03; // Percentage: 0.00..=1.00
    var cry = 0.015; // Percentage: 0.00..=1.00
    var cameraFollowVelFactor = 0.00; // Percentage: 0.00..=1.00
    var velMeasure = Math.sqrt(Math.pow(Math.abs(player.velX), 2) + Math.pow(Math.abs(player.velY), 2));
    var cfrx = crx * (1 - cameraFollowVelFactor) + (0.80 + velMeasure * 0.01) * cameraFollowVelFactor;
    var cfry = cry * (1 - cameraFollowVelFactor) + (0.80 + velMeasure * 0.01) * cameraFollowVelFactor;

    gameOffsetX = (player.pr-17 - disp.width/2) * cfrx + gameOffsetX * (1 - cfrx);
    gameOffsetY = (player.pt - disp.height/2) * cfry + gameOffsetY * (1 - cfry);
        //if(menuActive[0] && menuActive[1].purpose == "vehicle") { renderSize = 1; } // Vehicle zoom
    ctx.clearRect(0, 0, disp.width, disp.height);
    if(time == "day"){
        ctx.fillStyle = COLOR_SKY_DAY;
    } else if(time == "night"){
        ctx.fillStyle = COLOR_SKY_NIGHT;
    }
    ctx.fillRect(0, 0, disp.width, disp.height);
    var jLeft = Math.floor((gameOffsetX-mapCoord.x)/36);
    var jRight = jLeft+Math.ceil(disp.width / 36);
    var iTop = map.length - Math.ceil((disp.height+gameOffsetY-mapCoord.y) / 36);
    var iBottom = iTop+Math.ceil(disp.height/36);
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
        iTop = map.length-1;
    } else if (iTop < 0) {
        iTop = 0;
    };
    for(var j=iTop;j<=iBottom;j++){
        for(var l=jLeft;l<=jRight;l++){
            var x = Math.floor(mapCoord.x+36*l-gameOffsetX);
            var y = Math.floor((gameOffsetY + disp.height - 36 * (map.length - j))-mapCoord.y);
            if(map[j][l][1] != -5){
                drawSquare(x,y,map[j][l][0],2);
            } else {
                map[j][l][1] = 3;
                ctx.fillStyle = "#f0f0f0";
                ctx.fillRect(x,y,36, 36);
            }
        }
    }
    var inVehicles = [];
    for(var i=0;i<vehicles.length;i++){
        if(vehicles[i].inVehicle == -1){
            var jLeft = Math.floor((gameOffsetX-vehicles[i].x)/36);
            var jRight = jLeft+Math.ceil(disp.width / 36);
            var iTop = vehicles[i].map.length - Math.ceil((disp.height+gameOffsetY-vehicles[i].y) / 36);
            var iBottom = iTop+Math.ceil(disp.height/36);
            if (jLeft < 0) {
                jLeft = 0;
            } else if (jLeft >= vehicles[i].map[0].length) {
                jLeft = vehicles[i].map[0].length - 1;
            };
            if (jRight >= vehicles[i].map[0].length) {
                jRight = vehicles[i].map[0].length - 1;
            } else if (jRight < 0) {
                jRight = 0;
            };
            if (iBottom < 0) {
                iBottom = 0;
            } else if (iBottom >= vehicles[i].map.length) {
                iBottom = vehicles[i].map.length - 1;
            };
            if (iTop >= vehicles[i].map.length) {
                iTop = vehicles[i].map.length-1;
            } else if (iTop < 0) {
                iTop = 0;
            };
            for(var j=iTop;j<=iBottom;j++){
                for(var l=jLeft;l<=jRight;l++){
                    var x = Math.floor(vehicles[i].x+36*l-gameOffsetX);
                    var y = Math.floor((gameOffsetY + disp.height - 36 * (vehicles[i].map.length - j))-vehicles[i].y);
                    drawSquare(x,y,vehicles[i].map[j][l],2);
                }
            }
        } else {
            inVehicles.push(i);
        }
    }
    for(var p=0;p<inVehicles.length;p++){
        var i=inVehicles[p];
        var jLeft = Math.floor((gameOffsetX-vehicles[i].x)/36);
        var jRight = jLeft+Math.ceil(disp.width / 36);
        var iTop = vehicles[i].map.length - Math.ceil((disp.height+gameOffsetY-vehicles[i].y) / 36);
        var iBottom = iTop+Math.ceil(disp.height/36);
        if (jLeft < 0) {
            jLeft = 0;
        } else if (jLeft >= vehicles[i].map[0].length) {
            jLeft = vehicles[i].map[0].length - 1;
        };
        if (jRight >= vehicles[i].map[0].length) {
            jRight = vehicles[i].map[0].length - 1;
        } else if (jRight < 0) {
            jRight = 0;
        };
        if (iBottom < 0) {
            iBottom = 0;
        } else if (iBottom >= vehicles[i].map.length) {
            iBottom = vehicles[i].map.length - 1;
        };
        if (iTop >= vehicles[i].map.length) {
            iTop = vehicles[i].map.length-1;
        } else if (iTop < 0) {
            iTop = 0;
        };
        for(var j=iTop;j<=iBottom;j++){
            for(var l=jLeft;l<=jRight;l++){
                var x = Math.floor(vehicles[i].x+36*l-gameOffsetX);
                var y = Math.floor((gameOffsetY + disp.height - 36 * (vehicles[i].map.length - j))-vehicles[i].y);
                drawSquare(x,y,vehicles[i].map[j][l],2);
            }
        }
    }
    for (var i = 0; i < entities.length; i++) {
        var cpl = entities[i].pl;
        var cpr = entities[i].pr;
        var cpt = entities[i].pt;
        var cpb = entities[i].pb;
        var x = cpl - gameOffsetX;
        var y = gameOffsetY + disp.height - cpt;
        if(entities[i].type == 0){
            ctx.drawImage(entityImg[0], 0, 0, 34, 69, Math.ceil(x*renderSize), Math.ceil(y*renderSize), Math.ceil((cpr - cpl)*renderSize), Math.ceil((cpt - cpb)*renderSize));
        } else if(entities[i].type == 1){
            ctx.drawImage(entityImg[2], 0, 0, 34, 69, Math.ceil(x*renderSize), Math.ceil(y*renderSize), Math.ceil((cpr - cpl)*renderSize), Math.ceil((cpt - cpb)*renderSize));
        } else if(entities[i].type == 2){
            ctx.drawImage(entityImg[1], 0, 0, 34, 69, Math.ceil(x*renderSize), Math.ceil(y*renderSize), Math.ceil((cpr - cpl)*renderSize), Math.ceil((cpt - cpb)*renderSize));
        }
            ctx.drawImage(entityImg[0], 0, 0, 34, 69, Math.ceil(x*renderSize), Math.ceil(y*renderSize), Math.ceil((cpr - cpl)*renderSize), Math.ceil((cpt - cpb)*renderSize));
        if(entities[i].electric){
            ctx.fillStyle = "0xff0000";
            ctx.fillRect(x, y, cpr - cpl, cpt - cpb)
        }
    }
    for(var i=0;i<projectiles.length;i++){
        var cpl = projectiles[i].pl;
        var cpr = projectiles[i].pr;
        var cpt = projectiles[i].pt;
        var cpb = projectiles[i].pb;
        var x = cpl - gameOffsetX;
        var y = gameOffsetY + disp.height - cpt;
        if(projectiles[i].type == "metal"){
            ctx.drawImage(projectile, 0, 0, 18, 18, x, y, cpr - cpl, cpt - cpb);
        } else if(projectiles[i].type == "item"){
            if(projectiles[i].clickAction == 2){
                ctx.drawImage(textures[projectiles[i].select], 0, 0, 36, 36, x, y, cpr - cpl, cpt - cpb);
            } else if(projectiles[i].clickAction == 1){
                ctx.drawImage(wTextures[projectiles[i].select], 0, 0, 24, 90, x, y, cpr - cpl, cpt - cpb);
            } else if(projectiles[i].clickAction == 0){
                ctx.drawImage(iTextures[projectiles[i].select], 0, 0, 36, 36, x, y, cpr - cpl, cpt - cpb);
            }
        }
    }
    if (multiplayer) {
        for (var i = 0; i < playersPos.length; i++) {
            var cpl = playersPos[i].pl;
            var cpr = playersPos[i].pr;
            var cpt = playersPos[i].pt;
            var cpb = playersPos[i].pb;
            var x = cpl - gameOffsetX;
            var y = gameOffsetY + disp.height - cpt;
            if(playersPos[i].color >= 0 && playersPos[i].color < PLAYER_SOURCES.length){
                ctx.drawImage(playerPic[playersPos[i].color], 0, 0, 34, 69, x, y, cpr - cpl, cpt - cpb);
            } else {
                ctx.drawImage(playerPic[0], 0, 0, 34, 69, x, y, cpr - cpl, cpt - cpb);
            }
            if(playersPos[i].clickAction == 2){
                ctx.drawImage(textures[playersPos[i].select], 0, 0, 36, 36, x - 4, y + 30, 18, 18);
            } else if(playersPos[i].clickAction == 1){
                ctx.drawImage(wTextures[playersPos[i].select], 0, 0, 24, 90, x - 8, y + 3, 12, 45);
            } else if(playersPos[i].clickAction == 0){
                ctx.drawImage(iTextures[playersPos[i].select], 0, 0, 36, 36, x - 4, y + 30, 18, 18);
            }
        };
    };
    if(player.color >= 0 && player.color < PLAYER_SOURCES.length){
        ctx.drawImage(playerPic[player.color], 0, 0, 34, 69, (player.pl - gameOffsetX)*renderSize,(gameOffsetY + disp.height - player.pt)*renderSize,(player.pr - player.pl)*renderSize,(player.pt - player.pb)*renderSize);
    } else {
        ctx.drawImage(playerPic[0], 0, 0, 34, 69, (player.pl - gameOffsetX)*renderSize,(gameOffsetY + disp.height - player.pt)*renderSize,(player.pr - player.pl)*renderSize,(player.pt - player.pb)*renderSize);
    }
    if(player.electric){
        ctx.drawImage(electricEffect,0,0,54,84,player.pl - gameOffsetX - 10, gameOffsetY + disp.height - player.pt - 9, 54, 84);
    }
    if (player.itemBar[player.selected].clickAction != null && player.itemBar[player.selected].select != 0) {
        if (player.itemBar[player.selected].clickAction == 2) {
            ctx.drawImage(textures[player.itemBar[player.selected].select], 0, 0, 36, 36, Math.ceil((player.pl - gameOffsetX - 4)*renderSize), Math.ceil((gameOffsetY + disp.height - player.pt + 30)*renderSize), Math.ceil(18*renderSize), Math.ceil(18*renderSize));
        };
        if (player.itemBar[player.selected].clickAction == 1 && player.itemBar[player.selected].clickAction == 1) {
            drawWeapon(player.itemBar[player.selected].select);
        }
        if (player.itemBar[player.selected].clickAction == 0) {
            ctx.drawImage(iTextures[player.itemBar[player.selected].select], 0, 0, 36, 36, Math.ceil((player.pl - gameOffsetX - 4)*renderSize), Math.ceil((gameOffsetY + disp.height - player.pt + 30)*renderSize), Math.ceil(18*renderSize), Math.ceil(18*renderSize));
        };
    };
    if(time == "night"){
        ctx.fillStyle = COLOR_NIGHT_CANVAS_TINT;
        ctx.fillRect(0, 0, disp.width, disp.height);
    }
    var halfHp = null;
    //have a maxHp var that draws the amount of hearts possible and do something to have rows of hearts for each 30 hearts is one row
    if(player.health % 2 != 0){
        halfHp = Math.floor(player.health/2);
    }
    if(menuActive[0]){
        drawMenu();
    }
    for(var i=0;i<15;i++){
        if(halfHp != null && halfHp == i){
            ctx.drawImage(hitPointImgs[1],38*i,1,36,36);
        } else if(i > Math.ceil(player.health/2)-1){
            ctx.drawImage(hitPointImgs[2],38*i,1,36,36);
        } else {
            ctx.drawImage(hitPointImgs[0],38*i,1,36,36);
        }
    }
    for(var i=0;i<counter.length;i++){
        if(counter[i].visible == true){
            var output = ""+counter[i].out
            var chars = " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$:.";
            for(var j=0;j<output.length;j++){
                for(var l=0;l<chars.length;l++){
                    if(output[j] == chars[l]){
                        if(chars[l] != " "){
                            ctx.drawImage(characters[l],disp.width-28-14*(output.length-j),22+i*28,14,22);
                        }
                        break;
                    }
                }
            }
        }
    }
    for(var i=0;i<5;i++){
        if(i == player.selected){
            ctx.drawImage(barFrame[1],84*i+6,disp.height-72-18,84,84);
        } else {
            ctx.drawImage(barFrame[0],72*i+12*(i+1),disp.height-72-12,72,72);
        }
        if(player.itemBar[i].clickAction == 2){
            drawSquare(72*i+12*(i+1)+18,disp.height-66,player.itemBar[i].select,player.itemBar[i].clickAction);
        } else if(player.itemBar[i].clickAction == 1){
            if(player.itemBar[i].select != 0){
                ctx.drawImage(wTextures[player.itemBar[i].select],72*i+12*(i+1)+18,disp.height-66,12,40);
            }
        } else if(player.itemBar[i].clickAction == 0){
            drawItem(72*i+12*(i+1)+18,disp.height-66,player.itemBar[i].select);
        }
    }
    // for(var i=0;i<rays.length;i++){
    //     rays[i] = rayCast(player.pl+17,player.pt-15,(0.15625*i));
    //     ctx.lineTo();
    // }
    if (mobileControls) {
        drawMobileControls();
    }
    if (gameCharacterActive) {
        setTimeout(window.requestAnimationFrame(renderFrame),1000/60);
        // window.requestAnimationFrame(renderFrame);
    } else if (!gameCharacterActive) {
        console.log("GAME CHARACTER NOT ACTIVE")
        ctx.clearRect(0, 0, disp.width, disp.height);
    };
};
