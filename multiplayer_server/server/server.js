const http = require("http");
var session = {
    version:"1.7",
    limit:false,
    players:[

    ]
}
var worldSpawnPoint = {x:0,y:0}
var map = [];
var vehicles = [
    // {
    //     id:null,
    //     mounted:-1,
    //     movingLeft:false,
    //     movingRight:false,
    //     movingUp:false,
    //     movingDown:false,
    //     inVehicle: -1,
    //     xSpeed: 10,
    //     ySpeed: 10,
    //     maxXspeed:100,
    //     maxYspeed:100,
    //     x:0,
    //     y:0,
    //     velX:0,
    //     velY:0,
    //     map:[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,8,8,8,8,8,8,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,8,8,8,8,8,8,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,14,14,14,9,13,9,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,9,13,9,14,14,14,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,14,14,14,9,13,9,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,9,13,9,14,14,14,8,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,7,9,14,14,46,47,14,14,14,14,14,14,14,8,8,8,8,16,13,16,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,16,13,16,8,8,8,8,14,14,14,14,14,14,47,46,14,14,9,7,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,7,9,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,9,13,9,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,9,13,9,14,14,14,14,14,14,14,14,14,14,14,14,14,14,9,7,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,7,9,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,9,13,9,14,14,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,14,14,9,13,9,14,14,14,14,14,14,14,14,14,14,14,14,14,14,9,7,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,7,9,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,9,13,9,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,9,13,9,14,14,14,14,14,14,14,14,14,14,14,14,14,14,9,7,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,16,13,16,8,8,8,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,8,8,8,16,13,16,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,14,14,14,14,14,14,9,13,9,14,14,8,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,8,14,14,9,13,9,14,14,14,14,14,14,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,14,14,14,14,14,14,9,13,9,14,14,7,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,7,14,14,9,13,9,14,14,14,14,14,14,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,14,14,14,14,14,14,9,13,9,14,14,7,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,7,14,14,9,13,9,14,14,14,14,14,14,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,14,14,14,14,14,14,9,13,9,14,14,8,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,8,14,14,9,13,9,14,14,14,14,14,14,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,16,13,16,8,8,8,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,8,8,8,16,13,16,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],[7,9,14,14,14,14,14,14,14,9,10,10,9,14,14,14,14,14,14,9,10,10,9,14,14,14,14,9,13,9,8,14,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,14,8,9,13,9,14,14,14,14,9,10,10,9,14,14,14,14,14,14,9,10,10,9,14,14,14,14,14,14,9,7],[7,9,14,14,14,14,14,14,14,9,10,10,9,14,14,14,14,14,14,9,10,10,9,14,14,14,14,9,13,9,8,14,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,14,8,9,13,9,14,14,14,14,9,10,10,9,14,14,14,14,14,14,9,10,10,9,14,14,14,14,14,14,9,7],[7,9,14,14,14,14,14,14,14,9,10,10,9,14,14,14,14,14,14,9,10,10,9,14,14,14,14,9,13,9,8,14,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,9,14,14,14,14,14,14,14,14,8,9,13,9,14,14,14,14,9,10,10,9,14,14,14,14,14,14,9,10,10,9,14,14,14,14,14,14,9,7],[7,9,14,14,14,14,14,14,14,9,10,10,9,14,14,14,14,14,14,9,10,10,9,14,14,14,14,9,13,9,8,14,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,14,8,9,13,9,14,14,14,14,9,10,10,9,14,14,14,14,14,14,9,10,10,9,14,14,14,14,14,14,9,7],[8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,16,13,16,8,14,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,14,8,16,13,16,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,14,9,13,9,8,14,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,14,8,9,13,9,14,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,14,9,13,9,8,12,12,12,12,12,12,12,12,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,12,12,12,12,12,12,12,12,8,9,13,9,14,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,14,9,13,9,8,45,45,45,45,45,45,45,45,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,14,14,14,14,14,14,14,8,45,45,45,45,45,45,45,45,8,9,13,9,14,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,8,8,8,8,44,44,44,44,44,44,44,44,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,44,44,44,44,44,44,44,44,8,8,8,8,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
    // }
    {
        id:null,
        mounted:-1,
        movingLeft:false,
        movingRight:false,
        movingUp:false,
        movingDown:false,
        inVehicle: -1,
        xSpeed: 10,
        ySpeed: 10,
        maxXspeed:100,
        maxYspeed:100,
        x:0,
        y:0,
        velX:0,
        velY:0,
        map:[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,39,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,39,15,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,39,15,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,39,0,0,15,15,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,39,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,39,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,39,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,39,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,3,14,14,0,3,3,3,0,14,14,3,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,3,13,3,3,3,11,3,3,3,13,3,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,3,11,11,11,11,11,11,11,11,11,3,0,0,0,0,0,0,0,0,0,0,0],[0,0,39,15,15,0,0,0,0,3,13,11,11,11,11,11,11,11,13,3,0,0,0,0,0,0,39,15,15,0,0],[0,0,39,15,15,15,0,0,0,3,11,11,11,11,11,11,11,11,11,3,0,0,0,0,0,0,39,15,15,15,0],[0,0,39,0,0,15,15,0,0,3,3,3,3,3,13,3,3,3,3,3,0,0,0,0,0,0,39,0,0,15,15],[0,0,39,0,0,0,0,0,0,0,3,9,9,9,9,9,9,9,3,0,0,0,0,0,0,0,39,0,0,0,0],[3,0,3,0,14,0,0,0,0,0,3,9,9,9,13,9,9,9,3,0,0,0,0,0,14,0,3,0,3,0,0],[3,3,3,3,3,13,0,0,0,0,3,9,9,9,9,9,9,9,3,0,0,0,0,13,3,3,3,3,3,0,0],[3,11,11,11,14,0,0,0,0,0,14,9,9,9,13,9,9,9,14,0,0,0,0,0,14,11,11,11,3,0,0],[3,13,11,11,14,0,0,0,0,0,14,9,9,9,9,9,9,9,14,0,0,0,0,0,14,11,11,13,3,0,0],[3,11,3,3,3,3,3,3,3,3,3,2,2,2,13,2,2,2,3,3,3,3,3,3,3,3,3,11,3,0,0],[3,13,11,11,3,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,3,11,11,13,3,0,0],[3,11,11,11,3,9,9,10,10,9,9,9,9,9,13,9,9,9,9,9,10,10,9,9,3,11,11,11,3,0,0],[3,13,11,11,3,9,9,10,10,9,9,9,9,9,9,9,9,9,9,9,10,10,9,9,3,11,11,13,3,0,0],[3,11,11,11,3,9,9,10,10,9,9,3,3,3,3,3,3,3,9,9,10,10,9,9,3,11,11,11,3,0,0],[3,13,11,11,3,9,9,9,9,9,3,11,11,11,11,11,11,11,3,9,9,9,9,9,3,11,11,13,3,0,0],[3,11,3,3,3,9,9,9,9,3,11,11,10,10,10,10,10,11,11,3,9,9,9,9,3,3,3,11,3,0,0],[3,13,11,11,14,9,9,9,13,11,11,11,10,10,10,10,10,11,11,11,13,9,9,9,14,11,11,13,3,0,0],[3,11,11,11,14,9,9,13,11,11,11,11,11,11,46,11,11,11,11,11,11,13,9,9,14,11,11,11,3,0,0],[3,13,2,2,2,2,2,2,2,2,2,2,2,2,47,2,2,2,2,2,2,2,2,2,2,2,2,13,3,0,0],[3,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,3,0,0],[3,13,9,9,9,9,9,9,9,9,10,10,10,10,10,10,10,10,10,9,9,9,9,9,9,9,9,13,3,0,0],[14,9,9,9,9,19,9,9,9,9,10,10,10,10,10,10,10,10,10,9,9,9,9,21,9,9,9,9,14,0,0],[14,13,9,9,19,19,19,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,21,21,21,9,9,13,14,0,0],[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0]]
    }
];
for(var i=0;i<vehicles.length;i++){
    vehicles[i].id = genKey(8);
    vehicles[i].vertices = vehColSides(vehicles[i].map);
}
// var serverKey = genServerKey();
// console.log(serverKey)
var logs = [];
//
//
//
function worldGeneration(){
    var wMap = [];
    // var biomes = [1,1,1,1,1,0,1,1,2,1,1];
    var biomes = [1,0,1];
    var maxBiomes = 2;
    var yWaterLevel = 35;
    var curY = 80 - yWaterLevel - 2;
    var mainY = 35;
    for(var i=0;i<80;i++){
        wMap.push([]);
    }
    for(var i=0;i<biomes.length;i++){
        var fallFor = 0;
        var flatFor = 0;
        var riseFor = 0;
        var loopFor = 0;
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
            riseFor = 0;
            flatFor = Math.floor(Math.random() * (12 - 6 + 1) + 6);
            loopFor = fallFor+flatFor+riseFor;
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
            flatFor = Math.floor(Math.random() * (15 - 6 + 1) + 6);
            loopFor = fallFor+flatFor+riseFor;
        } else if(biome == 2){
            mainY = Math.floor(Math.random() * (16 - 7 + 1) + 7);
            if(curY > mainY){
                rise = true;
                riseFor = curY - mainY;
            }
            fallFor = 80 - yWaterLevel + mainY;
            loopFor = fallFor+riseFor+flatFor;
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
            curY += riseY;
            if(biome == 2 && curY <= yWaterLevel){
                minLength = 0;
                maxLength = 2;
            } else {
                minLength = 1;
                maxLength = 4;
            }
        }
            var distance = Math.floor(Math.random() * (maxLength - minLength + 1) + minLength);
            if(biome == 2 && Math.floor(Math.random() * (1 - 0 + 1) + 0) == 0){
                if(Math.floor(Math.random() * (1 - 0 + 1) + 0) == 1){
                    distance = 0;
                }
            }
                for(var ji=0;ji<distance;ji++){
                    for(var j=0;j<wMap.length;j++){
                        if(j<curY){
                            wMap[j].push([0,false,"air"]);
                        } else if (j == curY){
                            wMap[j].push([1,3,"grain"]);
                        } else if(j > curY && j < curY+5){
                            wMap[j].push([4,3,"grain"]);
                        } else if(j >= curY+5){
                            wMap[j].push([5,8,"stone"]);
                        }
                    }
                }
            }
    }
    for(var i=(80 - yWaterLevel);i<wMap.length;i++){
        for(var l=0;l<wMap[i].length;l++){
            if(wMap[i][l][0] == 0){
                wMap[i][l] = [13,false,"liquid"]
            } else if(wMap[i][l][0] == 1){
                wMap[i][l] = [20,3,"grain"]
                wMap[i+1][l] = [20,3,"grain"]
                wMap[i-1][l] = [20,3,"grain"]
            }
        }
    }
    map = wMap;
    genSpawn(biomes);
}
function genSpawn(biomes){
    var biomeLength = Math.floor((map[0].length-1)/biomes.length);
    var biomeSpawn = Math.random() * (biomes.length - 1) + 1;
    var xSpawnMax = biomeLength * biomeSpawn;
    var xSpawnMin = biomeLength * (biomeSpawn-1);
    var xSpawnPoint = Math.round(Math.random() * ((xSpawnMax-1) - xSpawnMin) + xSpawnMin);
    var ySpawnPoint = 0;
    for(var i=map.length-1;i>0;i--){
        if((map[i][xSpawnPoint][0] != 0 && map[i][xSpawnPoint][0] != 13) && map[i-1][xSpawnPoint][0] == 0 && map[i-2][xSpawnPoint][0] == 0){
            ySpawnPoint = map.length - i;
            break;
        }
    }
    worldSpawnPoint.x = (xSpawnPoint*36)+1;
    worldSpawnPoint.y = (ySpawnPoint*36)+1;
    for(var i=0;i<vehicles.length;i++){
        for(var i=0;i<vehicles.length;i++){
            vehicles[i].x = worldSpawnPoint.x;
            vehicles[i].y = worldSpawnPoint.y;
        }
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
            var log = "";
            log+="y - "+values[j][i][0]+" | ";
            log+="x - "+values[j][i][1]+" | "
            if(j == 1 || j == 3){
                log+="x - "+values[j][i][2]+" | "
            } else {
                log+="y - "+values[j][i][2]+" | "
            }
            console.log(log);
        }
        console.log();

    }
    return values;
}
function checkOverlaps(t1, r1, b1, l1, t2, r2, b2, l2) {
    var olx = false;
    var oly = false;
    var yCenter = (t2 + b2) / 2;
    var xCenter = (l2 + r2) / 2;
    if (l1 <= l2 && l2 <= r1) {
        olx = true;
    };
    if (l1 <= r2 && r2 <= r1) {
        olx = true;
    };
    if (t1 >= t2 && t2 >= b1) {
        oly = true;
    };
    if (t1 >= b2 && b2 >= b1) {
        oly = true;
    };
    if (l1 <= xCenter && xCenter <= r1) {
        olx = true;
    };
    if (b1 <= yCenter && yCenter <= t1) {
        oly = true;
    };
    return olx && oly;
};
function overlap(i, j, l, t, r, b) {
    var bt = 36 * (map.length - i);
    var bl = j * 36;
    var bb = bt - 36;
    var br = bl + 36;
    return checkOverlaps(t, r, b, l, bt, br, bb, bl);
};
function isSolid(val) {
    if (val != 0 && val != 9 && val != 10 && val != 11 && val != 13 && val != 14 && val != 17 && val != 19 && val != 29 && val != 36) {
        return true;
    }
    return false;
};
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
worldGeneration();
const WebSocketServer = require("websocket").server;
var sids = [];
var clients = {};
const httpServer = http.createServer()
const ws = new WebSocketServer({"httpServer":httpServer});
function getTime(){
    var date = new Date();
    var sec = date.getSeconds();
    var min = date.getMinutes();
    if(date.getMinutes() < 10){
        min = "0"+min;
    }
    if(date.getSeconds() < 10){
        sec = "0"+sec;
    }
    if(date.getHours() == 0){
        return "12:"+min+":"+sec+" am";
    }
    if(date.getHours() > 12){
        return (date.getHours() - 12)+":"+min+":"+sec+" pm";
    }
    return date.getHours()+":"+min+":"+sec+" am";
}
function genKey(length){
    const letters = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var credential = "";
    for(var i=0;i<length;i++){
        genNum = Math.floor(Math.random() * ((9 + letters.length) - 0) + 0);
        if(genNum > 9){
            credential += letters[genNum - 9];
        } else {
            credential += genNum;
        }
    }
    for(var i=0;i<vehicles.length;i++){
        if(vehicles[i].id == credential){
            return genKey(length);
        }
    }
    return credential;
}
function genServerKey(){
    const letters = "abcdefghijklmnopqrstuvwxyz!)&*(^@%$#ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var credential = "";
    for(var i=0; i<32;i++){
        genNum = Math.floor(Math.random() * ((9 + letters.length) - 0) + 0);
        if(genNum > 9){
            credential += letters[genNum - 9];
        } else {
            credential += genNum;
        }
    }
    return credential;
}
function genSid(){
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var credential = "";
    for(var i=0; i<16;i++){
        genNum = Math.floor(Math.random() * ((9 + letters.length) - 0) + 0);
        if(genNum > 9){
            credential += letters[genNum - 9];
        } else {
            credential += genNum;
        }
    }
    for(var i=0; i<sids.length;i++){
        if(credential == sids[i][0] || credential == sids[i][1]){
            return genSid();
        }
    }
    return credential;
}
function reGenSid(){
    clients2 = {};
    for(var i=0;i<sids.length;i++){
        var newSid = genSid();
        clients[sids[i][0]].prevSid = clients[sids[i][0]].sid;
        clients[sids[i][0]].sid = newSid;
        clients2[newSid] = clients[sids[i][0]];
        sids[i][1] = sids[i][0];
        sids[i][0] = newSid;
    }
    clients = clients2;
    for(var i=0;i<sids.length;i++){
        sendSid(sids[i][0]);
    }
}
function block(y,x,num) {
    var dBlocks = [[0,false,"air"],[1,3,"grain"],[2,5,"wood"],[3,8,"stone"],[4,3,"grain"],[5,8,"stone"],[6,8,"stone"],[7,3,"brittle"],[8,7,"stone"],[9,5,"wood"],[10,3,"brittle"],[11,8,"stone"],[12,8,"stone"],[13,false,"liquid"],[14,8,"stone"],[15,4,"silk"],[16,5,"cookie"],[17,false,"unknown"],[18,32,"stone"],[19,6,"metal"],[20,3,"grain"],[21,12,"stone"],[22,10,"stone"],[23,10,"stone"],[24,10,"stone"],[25,10,"stone"],[26,9,"stone"],[27,9,"stone"],[28,9,"stone"],[29,2,"grain"],[30,7,0,false,"stone"],[31,7,0,false,"stone"],[32,7,1000,"stone"],[33,7,"stone"],[34,7,1,"stone"],[35,7,0,"stone"],[36,2,"silk"],[37,12,{type:"storage",mouseX:0,mouseY:0,row:0,highlighted:0,tabs:0,inventory:[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]},"metal"],[38,7,0,false,"stone"],[39,5,"wood"],[40,6,0,{type:"interface",mouseX:0,mouseY:0,tabs:0,select:[0,0],rows:[[[0,"TYPE:"],[1,30,""]],[[0,"TYPE:"],[1,30,""]],[[0,"TYPE:"],[1,30,""]],[[0,"TYPE:"],[1,30,""]],[[0,"TYPE:"],[1,30,""]]]},"stone"],[41,6,1,{type:"interface",mouseX:0,mouseY:0,tabs:0,select:[0,0],rows:[[[0,"TYPE:"],[1,30,""]],[[0,"TYPE:"],[1,30,""]],[[0,"TYPE:"],[1,30,""]],[[0,"TYPE:"],[1,30,""]],[[0,"TYPE:"],[1,30,""]]]},"stone"],[42,6,0,[""],"stone"],[43,6,1,[""],"stone"]];
    if(y > map.length-1 || y < 0 || x > map[0].length-1 || x < 0 || num > dBlocks.length-1 || num < 0){
        console.log("Attempted block placement at invalid position and/or invalid block type");
        return;
    }
    map[y][x] = dBlocks[num];
}
function modifyBlock(y,x,val,data){
    if (map[y][x][0] == val){
        if(val == 42){
            for(var i=0;i<data.length;i++){
                map[y][x][3].rows[data[i][0]][data[i][1]][map[y][x][3].rows[data[i][0]][data[i][1]].length-1] = data[i][2];
            }
        }
    }
}
function parseBool(b){
    return b == "true";
}
function inMap(x,y){
    return !(x > map[0].length-1 || x < 0 || y < 0 || y > map.length-1);
}
var types = []
function processData(data){
    data = data.split("|");
    var idx = 0;
    var data1 = [];
    var active = false;
    for(var i=0;i<data.length;i++){
        if(data[i][0] == "<" && data[i][data[i].length-1] == ">"){
            if(active){
                active = false;
                idx++;
            }
            data1[idx] = [];
            data1[idx].push(data[i].split("<")[1].split(">")[0]);
            idx++;
        } else if(data[i][data[i].length-1] == ">"){
            if(!active){
                data1[idx] = data[i].split(">")[0];
            } else {
                data1[idx].push(data[i].split(">")[0]);
                active = false;
            }
            idx++;
        } else if(data[i][0] == "<"){
            if(active){
                idx++;
            }
            data1[idx] = [];
            data1[idx].push(data[i].split("<")[1]);
            active = true;
        } else {
            if(!active){
                data1[idx] = data[i];
                idx++;
            } else {
                data1[idx].push(data[i]);
            }
        }
    }
    return data1;
}
function entityInVehicle(val,xChange,yChange){
    // for(var i=0;i<vehicles.length;i++){
    //     if(vehicles[i].inVehicle == val){
    //         vehicles[i].x += xChange;
    //         vehicles[i].y += yChange;
    //         //something funky goes on here when too fast going left or up idk
    //         entityInVehicle(i,xChange,yChange)
    //     }
    // }
    for(var i=0;i<session.players.length;i++){
        if(session.players[i].inVehicle == val && vehicles[val].mounted != -1 && session.players[i].id[0] != vehicles[val].mounted[0]){
            session.players[i].pl += xChange;
            session.players[i].pr += xChange;
            session.players[i].pt += yChange;
            session.players[i].pb += yChange;
        }
    }
}
function realNums(nums, id){
    for(var i=0;i<nums.length;i++){
        var numVal = parseFloat(nums[i]);
        if(typeof numVal !== "number" || numVal != numVal || nums[i] == "Infinity" || nums[i] == "-Infinity"){
            kickUser(id);
            return false;
        }
    }
    return true;
}
ws.on("request", req => {
    var instance = req.accept(null, req.origin);
    instance.on("message", (e) => {
        var data = processData(e.utf8Data);
        if(data == -1){
            return;
        }
        for(var j=0;j<sids.length;j++){
            if(sids[j][0] == data[data.length-1] || sids[j][1] == data[data.length-1]){
                if(data[0] == "position" && data.length >= 20){
                    for(var i=0;i<session.players.length;i++){
                        // if(validPosUpdate(sids[j][0],data[1],data[4])){
                            if(data[data.length-1] == session.players[i].id[0] || data[data.length-1] == session.players[i].id[1]){
                                var checkNums = [data[1],data[2],data[3],data[4],data[13],data[14],data[15],data[16],data[17]]
                                if(realNums(checkNums,sids[i][0])){
                                    session.players[i].pl = parseFloat(data[1]);
                                    session.players[i].pr = parseFloat(data[2]);
                                    session.players[i].pt = parseFloat(data[3]);
                                    session.players[i].pb = parseFloat(data[4]);
                                    session.players[i].pw = parseBool(data[5]);
                                    session.players[i].ps = parseBool(data[6]);
                                    session.players[i].pa = parseBool(data[7]);
                                    session.players[i].pd = parseBool(data[8]);
                                    session.players[i].pspace = parseBool(data[9]);
                                    session.players[i].piw = parseBool(data[10]);
                                    session.players[i].pil = parseBool(data[11]);
                                    session.players[i].jmp = parseBool(data[12]);
                                    session.players[i].pxv = parseFloat(data[13]);
                                    session.players[i].pyv = parseFloat(data[14]);
                                    session.players[i].select = parseFloat(data[15]);
                                    session.players[i].clickAction = parseFloat(data[16]);
                                    session.players[i].inVehicle = parseFloat(data[17]);
                                    session.players[i].color = parseFloat(data[18]);
                                    clients[session.players[i].id[0]].timeout = 5;
                                }
                            }
                        }
                        // else {
                        //     console.log("too fast")
                        //     teleport(sids[i][0],session.players[i].pl,session.players[i].pb);
                        // }
                    // }
                }
                if(data[0] == "position" && data[19] == "true" && data.length == 32){
                    for(var i=0;i<vehicles.length;i++){
                        if(vehicles[i].id == data[20] && vehicles[i].mounted != -1 && (vehicles[i].mounted[0] == sids[j][0] || vehicles[i].mounted[1] == sids[j][0])){                            
                            var checkNum = [data[21],data[22],data[23],data[24],data[29],data[30]];
                            if(realNums(checkNum,sids[i][0])){
                                vehicles[i].x = parseFloat(data[21]);
                                vehicles[i].y = parseFloat(data[22]);
                                vehicles[i].xSpeed = parseFloat(data[23]);
                                vehicles[i].ySpeed = parseFloat(data[24]);
                                vehicles[i].movingLeft = parseBool(data[25]);
                                vehicles[i].movingRight = parseBool(data[26]);
                                vehicles[i].movingUp = parseBool(data[27]);
                                vehicles[i].movingDown = parseBool(data[28]);
                                vehicles[i].velX = parseFloat(data[29]);
                                vehicles[i].velY = parseFloat(data[30]);
                            }
                        }
                    }
                }
                if(data[0] == "mountVehicle"){
                    for(var i=0;i<session.players.length;i++){
                        if(data[data.length-1] == session.players[i].id[0] || data[data.length-1] == session.players[i].id[1]){
                            if(data[1] < vehicles.length && data[1] >= 0 && session.players[i].inVehicle != -1 && vehicles[data[1]].id == data[2] && (vehicles[data[1]].mounted == -1 || vehicles[data[1]].mounted[0] == session.players[i].id[0] || vehicles[data[1]].mounted[1] == session.players[i].id[0])){
                                vehicles[data[1]].mounted = session.players[i].id;
                                mountVehicle(sids[j][0],data[2]);
                                var log = "Mount Vehicle - uid:"+clients[sids[j][0]].inSid+" - Vehicle ID:"+data[2]+" - "+getTime();
                                console.log(log);
                            }
                        }
                    }
                } else if(data[0] == "unMountVehicle"){
                    for(var i=0;i<session.players.length;i++){
                        if(data[data.length-1] == session.players[i].id[0] || data[data.length-1] == session.players[i].id[1]){
                            if(data[1] < vehicles.length && data[1] >= 0 && vehicles[data[1]].id == data[2] && vehicles[data[1]].mounted != -1 && (vehicles[data[1]].mounted[0] == session.players[i].id[0] || vehicles[data[1]].mounted[1] == session.players[i].id[0])){
                                vehicles[data[1]].mounted = -1;
                                var log = "unMount Vehicle - uid:"+clients[sids[j][0]].inSid+" - Vehicle ID:"+data[2]+" - "+getTime();
                                console.log(log);
                            }
                        }
                    }
                }
                if(data[0] == "respawn"){
                    for(var i=0;i<vehicles.length;i++){
                        // if(vehicles[i].mounted != -1 && (vehicles[i].mounted[0] == session.players[i].id[0] || vehicles[i].mounted[1] == session.players[i].id[0]))
                        if(vehicles[i].mounted[0] == sids[j][0] || vehicles[i].mounted[1] == sids[j][0]){
                            vehicles[i].mounted = -1;
                        }
                    }
                    teleport(sids[j][0],worldSpawnPoint.x,worldSpawnPoint.y);
                    var log = "Respawn - uid:"+clients[sids[j][0]].inSid+" - "+getTime();
                    console.log(log);
                }
                if(data[0] == "build" && data.length == 5){
                    for(var i=0;i<session.players.length;i++){
                        if(data[data.length-1] == session.players[i].id[0] || data[data.length-1] == session.players[i].id[1]){
                            if(data[1] == NaN || data[2] == NaN || data[3] == NaN){
                                return;
                            }
                            var checkNums = [data[1],data[2],data[3]];
                            if(realNums(checkNums,sids[i][0]) && inMap(data[2],data[1])){
                                data[1] = parseInt(data[1]);
                                data[2] = parseInt(data[2]);
                                data[3] = parseInt(data[3]);
                                if(!PIB(data[1],data[2]) || !isSolid(data[3])){
                                    var prevBlock = map[data[1]][data[2]];
                                    block(data[1],[data[2]],data[3]);
                                    if(activeEnBlock(data[3]) != 0 && activeEnBlock(prevBlock[0]) == 1){
                                        energyRemoveT(data[2],data[1],data[3],prevBlock[2]);
                                    }
                                    if(activeEnBlock(data[3]) != -1){
                                        energyPlace(data[2],data[1],data[3]);
                                    }
                                    updateBlock(data[1],data[2],data[3]);
                                    var log = "Place Block - uid:"+clients[sids[j][0]].inSid+" - x:"+data[2]+" - y:"+data[1]+" - bId:"+data[3]+" - "+getTime()
                                    console.log(log);
                                    logs.push(log);
                                } else {
                                    undoBlock(session.players[i].id[0],data[1],data[2]);
                                }
                            }
                        }
                    }
                }
                if(data[0] == "addProj"){
                    for(var i=0;i<session.players.length;i++){
                        if(data[data.length-1] == session.players[i].id[0] || data[data.length-1] == session.players[i].id[1]){
                            addProj(data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],session.players[i].id[0]);
                            var log = "Drop Item - uid:"+clients[sids[j][0]].inSid+" - id:"+data[2]+" - clickAction:"+data[3]+" - bId:"+data[4]+" - "+getTime()
                            console.log(log);
                            logs.push(log);
                        }
                    }
                }
                if(data[0] == "delProj" && data.length == 3){
                    for(var i=0;i<session.players.length;i++){
                        if(data[data.length-1] == session.players[i].id[0] || data[data.length-1] == session.players[i].id[1]){
                            delProj(data[1]);
                            var log = "Collect Item - uid:"+clients[sids[j][0]].inSid+" - "+data[1]+" - "+getTime();
                            console.log(log);
                            logs.push(log);
                        }
                    }
                }
                if(data[0] == "modBlock"){
                    // for(var i=0;i<session.players.length;i++){
                    //     if(data[data.length-1] == session.players[i].id[0] || data[data.length-1] == session.players[i].id[1]){
                    //         data[1] = parseInt(data[1]);
                    //         data[2] = parseInt(data[2]);
                    //         data[3] = parseInt(data[3]);
                    //         var blockData = [];
                    //         for(var i=4;i<data.length-1;i++){
                    //             blockData.push(data[i]);
                    //         }
                    //         if(map[data[1]][data[2]][0] == data[3]){
                    //             modifyBlock(data[1],data[2],data[3],blockData);
                    //         }
                    //     }
                    // }
                }
                if(data[0] == "createVehicle"){
                    // for(var i=0;i<session.players.length;i++){
                    //     if(data[data.length-1] == session.players[i].id[0] || data[data.length-1] == session.players[i].id[1]){
                    //         vehicles.push(data[1])
                    //     }
                    // }
                }
                if(data[0] == "createVehicle"){
                    // for(var i=0;i<session.players.length;i++){
                    //     if(data[data.length-1] == session.players[i].id[0] || data[data.length-1] == session.players[i].id[1]){
                    //         vehicles.push(data[1])
                    //     }
                    // }
                }
                if(data[0] == "joinrequest"){
                    if(session.players.length < session.limit || session.limit == false && !clients[sids[j][0]].loadingGame && !clients[sids[j][0]].inGame){
                        clients[sids[j][0]].loadingGame = true; 
                        session.players.push({id:sids[j],pr:0,pl:0,pt:0,pb:0,vehX:0,vehY:0,pxv:0,pyv:0,pw:false,ps:false,pa:false,pd:false,pspace:false,piw:false,pil:false,jmp:false,select:0,clickAction:0,inVehicle:-1,color:0});
                        sendMap(sids[j][0]);
                        sendVehicles(sids[j][0]);
                        sendWorldSpawn(sids[j][0]);
                        var log = "User Join Request - uid:"+clients[sids[j][0]].inSid+" - "+getTime();
                        console.log(log);
                        logs.push(log);
                    } else {
                        clients[sids[j][0]].instance.send(JSON.stringify({type:"fullServer",message:"Server Full"}));
                    }
                }
                if(data[0] == "joinsession"){
                    if(!clients[sids[j][0]].inGame && clients[sids[j][0]].loadingGame){
                        clients[sids[j][0]].inGame = true;
                        var log = "User Join Game - uid:"+clients[sids[j][0]].inSid+" - "+getTime();
                        console.log(log);
                        logs.push(log);
                    }
                }
                if(data[0] == "--"){
                    clients[sids[j][0]].timeout = 5;
                }
            }
        }
    });
    var newSid = genSid();
    sids.push([newSid,""]);
    clients[newSid] = {instance:instance,inSid:newSid,prevSid:newSid,sid:newSid,loadingGame:false,inGame:false,kick:false,timeout:5};
    sendSid(newSid);
    var log = "User Connect - uid:"+newSid+" - "+getTime();
    console.log(log);
    logs.push(log);
});
function sendSid(sid){
    clients[sid].instance.send(JSON.stringify({type:"sid",sid:sid}));
}
function sendWorldSpawn(sid){
    clients[sid].instance.send(JSON.stringify({type:"worldSpawn",worldSpawnPoint:worldSpawnPoint}));
}
function mountVehicle(sid,id){
    clients[sid].instance.send(JSON.stringify({type:"mountVehicle",id:id}));
} 
function sendMap(sid){
    clients[sid].instance.send(JSON.stringify({type:"map",map:map}));
    console.log(`Sent Map - sid:${clients[sid].inSid}`);
}

function sendVehicles(sid){
    var sendData = [];
    for(var i=0;i<vehicles.length;i++){
        var veh = vehicles[i];
        sendData.push({x:veh.x,y:veh.y,velX:veh.velX,velY:veh.velY,xSpeed:veh.xSpeed,ySpeed:veh.ySpeed,inVehicle:veh.inVehicle,movingLeft:veh.movingLeft,movingRight:veh.movingRight,movingUp:veh.movingUp,movingDown:veh.movingDown,vertices:veh.vertices,map:veh.map,id:veh.id,maxXspeed:veh.maxXspeed,maxYspeed:veh.maxYspeed})
    }
    clients[sid].instance.send(JSON.stringify({type:"vehicleChange",vehicles:sendData}));
}
function undoBlock(sid,y,x){
    if(inMap(x,y)){
        clients[sid].instance.send(JSON.stringify({type:"block",sBlock:{x:parseFloat(x),y:parseFloat(y),bId:map[y][x][0]}}));
    }
}
function undoItem(sid,pos,bId){
    clients[sid].instance.send(JSON.stringify({type:"itemRemove",bId:bId,pos:pos}));
}
function kickUser(sid){
    clients[sid].kick = true;
}
function PIB(y,x){
    for(var i=0;i<session.players.length;i++){
        if(overlap(y,x,session.players[i].pl,session.players[i].pt,session.players[i].pr,session.players[i].pb)){
            return true;
        }
    }
    return false;
}
function validPosUpdate(sid,xPos,yPos){
    //fix this moving left glitches out
    var xRange = 36;
    var yRange = 108;
    for(var i=0;i<session.players.length;i++){
        if(session.players[i].id[0] == sid || session.players[i].id[1] == sid){
            // Math.abs(playersPos[i].pl - res.players[i].pl) > xRange || Math.abs(playersPos[i].pb - res.players[i].pb) > yRange
            // ^ that should help but instead og minusing player left by player right use player left by xPos
            if(session.players[i].pl+xRange < xPos || session.players[i].pb+yRange < yPos){
                // console.log((session.players[i].pl+range)+" "+xPos)
                return false;
            }
        }
    }
    return true;
}
function removePlayer(i){
    var sids2 = [];
    var players2 = [];
    var clients2 = {};
        if(clients[sids[i][0]].timeout > 0){
        clients2[sids[i][0]] = clients[sids[i][0]];
        for(var l=0;l<session.players.length;l++){
            if(session.players[l].id[0] == sids[i][0] || session.players[l].id[1] == sids[i][0]){
                players2.push(session.players[l]);
            }
        }
        sids2.push(sids[i]);
    } else {
        var log = "User Kicked - uid:"+clients[sids[i][0]].inSid+" - "+getTime();
        console.log(log);
        logs.push(log);
        push = true;
    }
}
function sessionTimeout(){
    var sids2 = [];
    var players2 = [];
    var clients2 = {};
    if(sids.length > 0){
        var push = false;
        for(var i=0;i<sids.length;i++){
            clients[sids[i][0]].timeout -= 1;
            if(clients[sids[i][0]].timeout <= 3){
                clients[sids[i][0]].instance.send(JSON.stringify({type:"--"}));
            }
            if(clients[sids[i][0]].timeout > 0 && !clients[sids[i][0]].kick){
                clients2[sids[i][0]] = clients[sids[i][0]];
                for(var l=0;l<session.players.length;l++){
                    if(session.players[l].id[0] == sids[i][0] || session.players[l].id[1] == sids[i][0]){
                        players2.push(session.players[l]);
                    }
                }
                sids2.push(sids[i]);
            } else {
                var log = "User Disconnect - uid:"+clients[sids[i][0]].inSid+" - "+getTime()
                console.log(log);
                logs.push(log);
                push = true;
                for(var ij=0;ij<vehicles.length;ij++){
                    if(vehicles[ij].mounted != -1 && (vehicles[ij].mounted[0] == sids[i][0] || session.players[ij].id[1] == sids[i][0])){
                        vehicles[ij].mounted = -1;
                    }
                }
            }
        }
        if(push){
            sids = sids2;
            session.players = players2;
            clients = clients2;
        }
    }
}
function logData(log){
    console.log(log);
    logs.push(log);
    for(var i=0;i<sids.length;i++){
        if(clients[sids].server){
            clients[sids].instance.send(JSON.stringify({type:"log",log:log})) // send the log
        }
    }
}
function filter(id){
    var sendData = [];
    for(var i=0;i<session.players.length;i++){
        if(session.players[i].id[0] != id && session.players[i].id[1] != id){
            sendData.push({pl:session.players[i].pl,pr:session.players[i].pr,pt:session.players[i].pt,pb:session.players[i].pb,vehX:session.players[i].vehX,vehY:session.players[i].vehY,pw:session.players[i].pw,ps:session.players[i].ps,pa:session.players[i].pa,pd:session.players[i].pd,pspace:session.players[i].pspace,pxv:session.players[i].pxv,pyv:session.players[i].pyv,piw:session.players[i].piw,pil:session.players[i].pil,jmp:session.players[i].jmp,select:session.players[i].select,clickAction:session.players[i].clickAction,inVehicle:session.players[i].inVehicle,color:session.players[i].color});
        }
    }
    return sendData;
}
function vehFilter(id){
    var sendData = [];
    for(var i=0;i<vehicles.length;i++){
        var veh = vehicles[i];
        if(veh.mounted[0] != id && veh.mounted[1] != id){
            sendData.push({x:veh.x,y:veh.y,velX:veh.velX,velY:veh.velY,xSpeed:veh.xSpeed,ySpeed:veh.ySpeed,inVehicle:veh.inVehicle,movingLeft:veh.movingLeft,movingRight:veh.movingRight,movingUp:veh.movingUp,movingDown:veh.movingDown})
        }
    }
    return sendData;
}
function teleport(sid,xPos,yPos){
    for(var i=0;i<session.players.length;i++){
        if(session.players[i].id[0] == sid || session.players[i].id[1] == sid){
            session.players[i].pl = xPos;
            session.players[i].pr = xPos+34;
            session.players[i].pb = yPos;
            session.players[i].pt = yPos+69;
            clients[sid].instance.send(JSON.stringify({type:"teleport",pos:{pl:xPos,pr:xPos+34,pt:yPos+69,pb:yPos}}));
        }
    }
}
function delProj(id){
    for(var i=0;i<session.players.length;i++){
        clients[session.players[i].id[0]].instance.send(JSON.stringify({type:"delProjectile",projId:id}));
    }
}
function addProj(type,id,clickAction,bId,velX,velY,x,y,sid){
    for(var i=0;i<session.players.length;i++){
        if(session.players[i].id[0] != sid && session.players[i].id[1] != sid){
            if(clickAction == 0 || clickAction == 2){
                clients[session.players[i].id[0]].instance.send(JSON.stringify({type:"addProjectile",projectile:{type:type,id:id,clickAction:parseFloat(clickAction),select:parseFloat(bId),velX:parseFloat(velX),velY:parseFloat(velY),pl:parseFloat(x),pr:parseFloat(x)+24,pb:parseFloat(y),pt:parseFloat(y)+24,stop:[false,false]}}));
            } else if(clickAction == 1){
                clients[session.players[i].id[0]].instance.send(JSON.stringify({type:"addProjectile",projectile:{type:type,id:id,clickAction:parseFloat(clickAction),select:parseFloat(bId),velX:parseFloat(velX),velY:parseFloat(velY),pl:parseFloat(x),pr:parseFloat(x)+18,pb:parseFloat(y),pt:parseFloat(y)+80,stop:[false,false]}}));
            }
        }
    }
}
function updateBlock(y,x,bId){
    if(session.players.length > 0){
        for(var i=0;i<session.players.length;i++){
            clients[session.players[i].id[0]].instance.send(JSON.stringify({type:"block",sBlock:{x:parseFloat(x),y:parseFloat(y),bId:parseFloat(bId)}}));
        }
    }
}
function updateGame(){
    if(session.players.length > 0){
        for(var i=0;i<session.players.length;i++){
            clients[session.players[i].id[0]].instance.send(JSON.stringify({type:"position",players:filter(session.players[i].id[0]),vehicles:vehFilter(session.players[i].id[0])}));
        }  
    }
}
setInterval(updateGame, 1000/15);
setInterval(sessionTimeout,1000);
setInterval(reGenSid,15000);

// TODO: fix server performance

const PORT = 5002;
const HOST = "127.0.0.1"; // 127.0.0.1
httpServer.listen(PORT, HOST, () => console.log(`Server open on port : ${PORT} - ${getTime()}`));
