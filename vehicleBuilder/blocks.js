const selection = document.getElementById("blocks");
const cx = selection.getContext("2d");

const BLOCK_DISP_COLUMNS = 6;
const BLOCK_DISP_ROWS = 10;
selection.height = 50 * BLOCK_DISP_ROWS;
selection.width = 50 * BLOCK_DISP_COLUMNS;
// selection.width = 266;
var textures = [];
renderSize = 1
function setUpBlocks(){
    for(var j = 0; j < BLOCK_SOURCES.length; j++) {
        textures[j] = document.createElement("IMG");
        if (j != 0) {
            textures[j].src = '../texture/' + BLOCK_SOURCES[j];
        };
    };
    render();
    setTimeout(render,250);
    setTimeout(render,1000);
    setTimeout(render,1000);
}
function buttonClick(x,y,t,b,r,l){
    return x <= r && x >= l && y <= t && y >= b;
}
function clickBtn(ev){
    var rect = selection.getBoundingClientRect();
    var xPos = ev.clientX - rect.left;
    var yPos = ev.clientY - rect.top;
    for(var j=0;j<Math.ceil(BLOCK_SOURCES.length/BLOCK_DISP_COLUMNS);j++){
        for(var i=0;i<BLOCK_DISP_COLUMNS;i++){
            if(buttonClick(xPos,yPos,(36*j)+(16*j)+36,(36*j)+(16*j),(36*i)+(16*i)+36,(36*i)+(16*i))){
                if(j*BLOCK_DISP_COLUMNS+i < BLOCK_SOURCES.length){
                    blockSelect = j*BLOCK_DISP_COLUMNS+i;
                    render2();
                    render();
                }
            }
        }
    }
}
selection.addEventListener("mousedown", function (ev) {clickBtn(ev)});
function drawBlock(x,y,val){
    if (val != 0) {
        cx.drawImage(textures[val], 0, 0, 36, 36, Math.ceil(x*renderSize), Math.ceil(y*renderSize), Math.ceil(36*renderSize), Math.ceil(36*renderSize));
    } else {
        cx.fillStyle = "#afafaf67";
        cx.fillRect(x,y,36,36);
    }
}
function render(){
    cx.clearRect(0, 0, selection.width, selection.height);
    var val=0;
    for(var i=0;i<BLOCK_SOURCES.length;i++){
        if((val*BLOCK_DISP_COLUMNS+BLOCK_DISP_COLUMNS)-i == 0){
            val++;
        }
        drawBlock((i-(val*BLOCK_DISP_COLUMNS))*(36+16),val*(36+16),i);
    }
}
setUpBlocks();
