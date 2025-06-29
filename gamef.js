const ws = new WebSocket("wss://server.tivect.com");
// const ws = new WebSocket("ws://localhost:5001");
var sid;
var gameMode = "Singleplayer";
var multi = false;
var updateQue = [];
var serverMap;
var loadData = {
    usingData: false,
    dataLoaded: false,
    saveFile: [],
};
var loadServerData = {
    usingData:false,
    mapLoaded: false,
    spawnPointLoaded: false,
}
var load = null;
ws.onmessage = function (e) {
    var res = JSON.parse(e.data);
    if(res.type == "--") {
        ws.send(`--|${sid}`);
    }
    if(multi){
        if (res.type == "position") {
            var coordSend;
            var vehicleSend;
            if(menuActive[0] && menuActive[1].purpose == "vehicle"){
                veh = vehicles[menuActive[1].isVehicle];
                vehicleSend = `true|${veh.id}|${veh.x}|${veh.y}|${veh.xSpeed}|${veh.ySpeed}|${veh.movingLeft}|${veh.movingRight}|${veh.movingUp}|${veh.movingDown}|${veh.velX}|${veh.velY}`;
            } else {
                vehicleSend = `false`;
            }
            if(player.inVehicle != -1){
                vehicle = vehicles[player.inVehicle];
                coordSend = `${player.pl-vehicle.x}|${player.pr-vehicle.x}|${player.pt-vehicle.y}|${player.pb-vehicle.y}`;
            } else {
                coordSend = `${player.pl}|${player.pr}|${player.pt}|${player.pb}`;
            }
            // console.log(coordSend)
            ws.send(`position|${coordSend}|${controls.keys[3][1]}|${controls.keys[4][1]}|${controls.keys[1][1]}|${controls.keys[2][1]}|${controls.keys[0][1]}|${player.inWater}|${player.inLeaves}|${player.jumping}|${player.velX}|${player.velY}|${player.itemBar[player.selected].select}|${player.itemBar[player.selected].clickAction}|${player.inVehicle}|${player.color}|${vehicleSend}|${sid}`);
            if (vehicles.length != res.vehicles.length) {
                //send a request for the vehicles
            } else {
                for (var i = 0; i < vehicles.length; i++) {
                    var xRange = 1;
                    var yRange = 1;
                    if((vehicles[i].movingLeft || vehicles[i].movingRight) && !(vehicles[i].movingLeft && vehicles[i].movingRight)){
                        xRange = 6;
                    }
                    if((vehicles[i].movingUp || vehicles[i].movingDown) && !(vehicles[i].movingDown && vehicles[i].movingDown)){
                        yRange = 6;
                    }
                    if (Math.abs(vehicles[i].x - res.vehicles[i].x) > xRange || Math.abs(vehicles[i].y - res.vehicles[i].y) > yRange) {
                        // entityInVehicle(i,res.vehicles[i].x - vehicles[i].x, res.vehicles[i].y - vehicles[i].y)
                        // for(var i=0;i<playersPos.length;i++){
                            
                        // }
                        //
                        // for(var j=0;j<vehicles.length;j++){
                        //     if(vehicles[j].inVehicle == val){
                        //         vehicles[j].x += xChange;
                        //         vehicles[j].y += yChange;
                        //         //something funky goes on here when too fast going left or up idk
                        //         entityInVehicle(j,xChange,yChange)
                        //     }
                        // }
                        var xChange = res.vehicles[i].x - vehicles[i].x;
                        var yChange = res.vehicles[i].y - vehicles[i].y;
                        if(player.inVehicle == i){
                            gameOffsetX += xChange;
                            gameOffsetY += yChange;
                            player.pl += xChange;
                            player.pr += xChange;
                            player.pt += yChange;
                            player.pb += yChange;
                        }
                        for(var j=0;j<entities.length;j++){
                            if(entities[j].inVehicle == i){
                                entities[j].pl += xChange;
                                entities[j].pr += xChange;
                                entities[j].pt += yChange;
                                entities[j].pb += yChange;
                            }
                        }
                        for(var j=0;j<playersPos.length;j++){
                            // console.log(playersPos[j].inVehicle)
                            if(playersPos[j].inVehicle == i){
                                // console.log(xChange+" "+yChange)
                                playersPos[j].pl += xChange;
                                playersPos[j].pr += xChange;
                                playersPos[j].pt += yChange;
                                playersPos[j].pb += yChange;
                                // playersPos[j].vehX = xChange;
                                // playersPos[j].vehY = yChange;
                            }
                        }
                        //
                        vehicles[i].x = res.vehicles[i].x;
                        vehicles[i].y = res.vehicles[i].y;
                        vehicles[i].xSpeed = res.vehicles[i].xSpeed;
                        vehicles[i].ySpeed = res.vehicles[i].ySpeed;
                        vehicles[i].velX = res.vehicles[i].velX;
                        vehicles[i].velY = res.vehicles[i].velY;
                        vehicles[i].inVehicle = res.vehicles[i].inVehicle;
                        vehicles[i].movingLeft = res.vehicles[i].movingLeft;
                        vehicles[i].movingRight = res.vehicles[i].movingRight;
                        vehicles[i].movingUp = res.vehicles[i].movingUp;
                        vehicles[i].movingDown = res.vehicles[i].movingDown;
                    } else {
                        // var vehX = vehicles[i].x;
                        // var vehY = vehicles[i].y;
                        // entityInVehicle(i,res.vehicles[i].x - vehicles[i].x, res.vehicles[i].y - vehicles[i].y)
                        vehicles[i].xSpeed = res.vehicles[i].xSpeed;
                        vehicles[i].ySpeed = res.vehicles[i].ySpeed;
                        vehicles[i].velX = res.vehicles[i].velX;
                        vehicles[i].velY = res.vehicles[i].velY;
                        vehicles[i].inVehicle = res.vehicles[i].inVehicle;
                        vehicles[i].movingLeft = res.vehicles[i].movingLeft;
                        vehicles[i].movingRight = res.vehicles[i].movingRight;
                        vehicles[i].movingUp = res.vehicles[i].movingUp;
                        vehicles[i].movingDown = res.vehicles[i].movingDown;
                        // vehicles[i].x = vehX;
                        // vehicles[i].y = vehY;
                    }
                }
            }
            if (playersPos.length != res.players.length) {
                playersPos = res.players;
            } else {
                for (var i=0;i<playersPos.length;i++) {
                    var xRange = 2;
                    var yRange = 10;
                    if((playersPos[i].pa || playersPos[i].pd) && !(playersPos[i].pa && playersPos[i].pd)){
                        xRange = 6;
                        if(playersPos[i].pw){
                            xRange = 12;
                        }
                    }
                    var xAdd = 0;
                    var yAdd = 0;
                    if(res.players[i].inVehicle != -1){
                        // if(Math.abs(playersPos[i].pl - res.players[i].pl - (playersPos[i].vehX - res.players[i].pl)) > xRange+vehicles[playersPos[i].inVehicle].xSpeed|| Math.abs(playersPos[i].pb - res.players[i].pb) + (res.players[i].pb - playersPos[i].vehY) > yRange){

                        // }
                        // var vehAdd = playersPos[i].inVehicle
                        // xAdd = res.vehicles[vehAdd].x - playersPos[i].vehX;
                        // yAdd = res.vehicles[vehAdd].y - playersPos[i].vehY;
                        var vehicle = vehicles[res.players[i].inVehicle];
                        xAdd = vehicle.x;
                        yAdd = vehicle.y;

                    }
                        // if(Math.abs(playersPos[i].pl - res.players[i].pl - (playersPos[i].vehX - res.players[i].pl)) > xRange+vehicles[playersPos[i].inVehicle].xSpeed|| Math.abs(playersPos[i].pb - res.players[i].pb) + (res.players[i].pb - playersPos[i].vehY) > yRange){
                        //     // console.log((res.players[i].pl - playersPos[i].vehX)+" "+(res.players[i].pb - playersPos[i].vehY))
                        //     console.log(Math.abs(playersPos[i].pb - res.players[i].pb) + (res.players[i].pb - playersPos[i].vehY))
                        //     playersPos[i] = res.players[i]; 
                        // } else {
                        //     var ppl = playersPos[i].pl;
                        //     var ppr = playersPos[i].pr;
                        //     var ppt = playersPos[i].pt;
                        //     var ppb = playersPos[i].pb;
                        //     playersPos[i] = res.players[i];
                        //     playersPos[i].pl = ppl;
                        //     playersPos[i].pr = ppr;
                        //     playersPos[i].pt = ppt;
                        //     playersPos[i].pb = ppb;
                        // 
                        // console.log(xAdd)
                    // console.log(Math.abs(playersPos[i].pl - res.players[i].pl) - xAdd)
                    // console.log(res.players[i].inVehicle+" "+playersPos[i].inVehicle)
                    // playersPos[i].inVehicle = res.players[i].inVehicle;
                    if (Math.abs(playersPos[i].pl - (res.players[i].pl + xAdd)) > xRange|| Math.abs(playersPos[i].pb - (res.players[i].pb + yAdd)) > yRange) {
                        playersPos[i] = res.players[i];
                        playersPos[i].pl += xAdd;
                        playersPos[i].pr += xAdd;
                        playersPos[i].pt += yAdd;
                        playersPos[i].pb += yAdd;
                    } else {
                        var ppl = playersPos[i].pl;
                        var ppr = playersPos[i].pr;
                        var ppt = playersPos[i].pt;
                        var ppb = playersPos[i].pb;
                        playersPos[i] = res.players[i];
                        playersPos[i].pl = ppl;
                        playersPos[i].pr = ppr;
                        playersPos[i].pt = ppt;
                        playersPos[i].pb = ppb;
                    }
                    // if(playersPos[i].inVehicle != -1){
                    //     playersPos[i].vehX = res.vehicles[playersPos[i].inVehicle].x;
                    //     playersPos[i].vehY = res.vehicles[playersPos[i].inVehicle].y;
                    // }
                }
            }
            
            
            
        }
        if(res.type == "mountVehicle"){
            for(var i=0;i<vehicles.length;i++){
                if(vehicles[i].id == res.id){
                    menuActive[1] = vehicleInterface.controls;
                    menuActive[1].isVehicle = i;
                    menuActive[0] = true;
                    return;
                }
            }
        }
        if(res.type == "teleport"){
            player.pl = res.pos.pl;
            player.pr = res.pos.pr;
            player.pb = res.pos.pb;
            player.pt = res.pos.pt;
            gameOffsetY = player.pb-(disp.height/2)+1;
            gameOffsetX = player.pl-(disp.width/2)+1;
        }
        if(res.type == "addProjectile"){
            projectiles.push(res.projectile);
        }
        if(res.type == "delProjectile"){
            removeProjectile(res.projId);
        }
        if(res.type == "block"){
            if(validBlockClick(res.sBlock.y,res.sBlock.x)){
                var prevBlock = map[res.sBlock.y][res.sBlock.x];
                block(res.sBlock.y,res.sBlock.x,res.sBlock.bId);
                if(activeEnBlock(res.sBlock.bId) != 0 && activeEnBlock(prevBlock[0]) == 1){
                    energyRemoveT(res.sBlock.x,res.sBlock.y,res.sBlock.bId,prevBlock[2]);
                }
                if(activeEnBlock(res.sBlock.bId) != -1){
                    energyPlace(res.sBlock.x,res.sBlock.y,res.sBlock.bId);
                }
            }
        }
        if(res.type == "attack"){
            knockedback(res.knockback);
        }
        if(res.type == "respawn"){
            respawn();
        }
        // if(res.type == "menu"){
        //     menuActive[0] = true;
        //     menuActive[1] = res.menuData;
        // }
    }
    if(res.type == "vehicleChange"){
        vehicles = res.vehicles;
    }
    if(res.type == "map"){
        map = res.map;
        respawn();
        loadServerData.mapLoaded = true;
        loadData.dataLoaded = true;
        multi = true;
        multiplayer = true;
        // ws.send(`joinsession|${sid}`);
    }
    if(res.type == "worldSpawn"){
        worldSpawnPoint = res.worldSpawnPoint;
        player.pl = worldSpawnPoint.x;
        player.pr = worldSpawnPoint.x+34;
        player.pb = worldSpawnPoint.y;
        player.pt = worldSpawnPoint.y+69;
        gameOffsetY = worldSpawnPoint.y-(disp.height/2)+1;
        gameOffsetX = worldSpawnPoint.x-(disp.width/2)+1;
        respawn();
        for(var ij=0;ij<vehicles.length;ij++){
            vehicles[ij].x = worldSpawnPoint.x+108;
            vehicles[ij].y = worldSpawnPoint.y

        }
        loadServerData.spawnPointLoaded = true;
    }
    if (res.type == "sid") {
        sid = res.sid;
    }
}
function notVehicle(){

}
function loadScreen(state){
    if(state == 1){
        document.getElementById("amc05").style.display = "none";
        document.getElementById("loadingScreen").style.display = "inline";
    } else if(state == 0){
        document.getElementById("amc05").style.display = "inline";
        document.getElementById("loadingScreen").style.display = "none";
    }
}
function dataLoaded(){
    if(!loadData.dataLoaded && (loadData.usingData || gameMode == "Multiplayer")){
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("mainScreen").style.display = "inline";
        document.getElementById("menu").style.display = "inline";
        document.getElementById("amc05").style.display = "none";
        clearInterval(load);
        load = null;
        multi = false;
        multiplayer = false;
        loadServerData.usingData = false;
    }
}
function getFile() {
    document.getElementById("saveFile").click();
}
function toGame() {
    document.getElementById("amc05").style.display = "none";
    document.getElementById("amc03").style.display = "inline";
}
document.getElementById("gameMode").onclick = function switchMode() {
    if(gameMode == "Singleplayer"){
        gameMode = "Multiplayer";
        document.getElementById("gameMode").innerHTML = "Multiplayer";
    } else if(gameMode == "Multiplayer"){
        gameMode = "Singleplayer";
        document.getElementById("gameMode").innerHTML = "Singleplayer";
    }
}
document.getElementById("start").onclick = function launchGame() {
    //fix this it is partially working
    document.getElementById("mainScreen").style.display = "none";
    document.getElementById("menu").style.display = "none";
    document.getElementById("amc05").style.display = "inline";
    if(gameMode == "Multiplayer" && !loadServerData.usingData){
        loadServerData.usingData = true;
        ws.send(`joinrequest|${sid}`);
        load = setInterval(loadGame,100);
    }
    loadScreen(1);
    loadGame();
    setTimeout(dataLoaded,5000);
}
function loadGame(){
    if((multiplayer && loadServerData.mapLoaded && loadServerData.spawnPointLoaded) || (loadData.usingData && loadData.dataLoaded) || (!loadData.usingData && gameMode == "Singleplayer") && !loaded){
        if(loadData.usingData && gameMode == "Singleplayer"){
            map = loadData.saveFile.gameMap;
            gameOffsetX = loadData.saveFile.gameOffsetX;
            gameOffsetY = loadData.saveFile.gameOffsetY;
            player = loadData.saveFile.player;
            clickAction = loadData.saveFile.clickAction;
            blockSelect = loadData.saveFile.blockSelect;
            swordSelect = loadData.saveFile.swordSelect;
            entities = loadData.saveFile.entities;
        }
        clearInterval(load);
        load = null;
        loadScreen(0);
        gameSetup();
    }
}
function vehColSides(veh){
    var values = [];
    for(var i=0;i<4;i++){
      values.push([]);
    }
    for(var j=veh[0].length-1;j>=0;j--){
      var y = veh.length-1;
      var curLen = 0;
      for(var i=0;i<veh.length;i++){
        if(veh[i][j] != 0 && (j+1 > veh[i].length-1 || veh[i][j+1] == 0)){
          curLen += 1;
        } else if(curLen > 0){
          values[1].push([y+curLen,j,y]);
          curLen = 0;
        }
        y--;
      }
      if(curLen > 0){
        values[1].push([y+curLen,j,y]);
        curLen = 0;
      }
    }
    for(var j=veh[0].length-1;j>=0;j--){
      var y = veh.length-1;
      var curLen = 0;
      for(var i=0;i<veh.length;i++){
        if(veh[i][j] != 0 && (j-1 < 0 || veh[i][j-1] == 0)){
          curLen += 1;
        } else if(curLen > 0){
          values[3].push([y+curLen,j,y]);
          curLen = 0;
        }
        y--;
      }
      if(curLen > 0){
        values[3].push([y+curLen,j,y]);
        curLen = 0;
      }
    }
    for(var i=0;i<veh.length;i++){
      var curLen = 0;
      for(var j=0;j<veh[i].length;j++){
        if(veh[i][j] != 0 && (i-1 < 0 || veh[i-1][j] == 0)){
          curLen += 1;
        } else if(curLen > 0){
          values[0].push([veh.length-i-1,j-curLen,j]);
          curLen = 0;
        }
      }
      if(curLen > 0){ 
        values[0].push([veh.length-i-1,veh[i].length-curLen,veh[i].length]);
        curLen = 0;
      }
    }
    for(var i=veh.length-1;i>=0;i--){
      var curLen = 0;
      for(var j=0;j<veh[i].length;j++){
        if(veh[i][j] != 0 && (i+1 > veh.length-1 || veh[i+1][j] == 0)){
          curLen += 1;
        } else if(curLen > 0){
          values[2].push([veh.length-i-1,j-curLen,j]);
          curLen = 0;
        }
      }
      if(curLen > 0){
        values[2].push([veh.length-i-1,veh[i].length-curLen,veh[i].length]);
        curLen = 0;
      }
    }
    console.log("\nNEW VEHICLE VERTICES\n0 1 2 3\nt r b l\n");
    for(var j=0;j<values.length;j++){
      console.log("Direction - "+j);
      for(var i=0;i<values[j].length;i++){
        var vert = "";
          vert += "y - "+values[j][i][0]+" | ";
          vert += "x - "+values[j][i][1]+" | ";
          if(j == 1 || j == 3){
            vert += "x - "+values[j][i][2]+" | ";
          } else {
            vert += "y - "+values[j][i][2]+" | ";
          }
          console.log(vert);
      }
    }
    return values;
}
function readSave() {
    loadData.usingData = true;
    const readFile = new FileReader();
    var file = document.getElementById("saveFile").files[0];
    readFile.onload = function (ev) {
        var fullData = ev.target.result.split("|||");
        if(fullData[0] == "tivect-world"){
            loadData.saveFile = JSON.parse(fullData[1])
            loadData.dataLoaded = true;
        } else {
            if(fullData[0] == "tivect-vehicle"){
                var vehicleMap = JSON.parse(fullData[1]);
                var vehicleAdd = {
                    id:genItemID(),
                    movingLeft:false,
                    movingRight:false,
                    movingUp:false,
                    movingDown:false,
                    cruise:false,
                    inVehicle: -1,
                    xSpeed: 1,
                    ySpeed: 1,
                    maxXspeed:10000,
                    maxYspeed:10000,
                    x:0,
                    y:0,
                    velX:0,
                    velY:0,
                    map:null,
                    vertices:null,
                    properties:null,
                }
                vehicleAdd.map = vehicleMap.vehicle;
                vehicleAdd.vertices = vehColSides(vehicleMap.vehicle);
                vehicles.push(vehicleAdd);
            }
            loadData.usingData = false;
        }
    }
    readFile.readAsText(file, "UTF-8");
}
function encrypt(input) {
    var data = JSON.stringify(input);
    var place = 4;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()_+=-{}[]|\"':;?/>.<,~`";
    var scattered = data.match(/.{1,7}/g);
    for (var l = 0; l < scattered.length; l++) {
        for (var i = 0; i < scattered[l].length; i++) {
            if (chars + place > chars.length) {

            }
        }
    }
    return data;
}
function saveGame() {
    var downloadSave = document.getElementById("downloadSave");
    downloadSave.href = "data:text/plain;charset=UTF-8," + encodeURIComponent("tivect-worldsave|||") + encodeURIComponent(
        encrypt({gameMap: map, gameOffsetX: gameOffsetX, gameOffsetY: gameOffsetY, player: player, clickAction: clickAction, blockSelect: blockSelect, swordSelect: swordSelect, entities: entities})
    );
    downloadSave.click();
}