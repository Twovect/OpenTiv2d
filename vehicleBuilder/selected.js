const bSelect = document.getElementById("selected");
const c = bSelect.getContext("2d");
c.imageSmoothingEnabled = false;
bSelect.height = 84;
bSelect.width = 84;
var barFrame = [];
var btns = [];
var barFrameSrc = ["blockFrame.png","selectFrame.png"];
var chars = ["plus.png","minus.png"];
function setUpSelect(){
    for(var j=0;j<2;j++){
        barFrame[j] = document.createElement("IMG");
        barFrame[j].src = '../texture/' + barFrameSrc[j];
    }
    for(var j=0;j<2;j++){
        btns[j] = document.createElement("IMG");
        btns[j].src = '../texture/chars/' + chars[j];
    }
    setTimeout(render2,250);
    setTimeout(render2,1000);
    setTimeout(render2,1000);

}
function render2(){
    c.clearRect(0, 0, bSelect.width, bSelect.height);
    c.fillStyle = "#afafaf85";
    c.fillRect(0,0,84,84);
    var mid = 84/2-36/2;
    c.drawImage(barFrame[1],0,0);
    c.drawImage(textures[blockSelect], 0, 0, 36, 36, mid, mid, 36, 36);
    // for(var i=0;i<2;i++){
    //     c.drawImage(barFrame[i],0,0,22,36)
    // }
}
setUpSelect();
