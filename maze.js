// Variables
var canvas;
var ctx;
// Variable for the algorithm
var output;

var WIDTH = 1000;
var HEIGHT = 600;

tileW = 20;
tileH = 20;

tileRowCount =25;
tileColumnCount = 40;

boundX = 0;
boundY = 0;

var tiles = [];
for (c = 0; c < tileColumnCount; c++) {
    tiles[c] = [];
    for (r = 0; r < tileRowCount; r++) {
        tiles[c][r] = {x: c*(tileW+3), y: r*(tileH+3), state: 'e'}; //state is e for empty
    }
}

tiles[0][0].state = 's';
tiles[tileColumnCount-1][tileRowCount-1].state = 'f';

function rect(x,y,w,h,state) {

    if (state == 's') {
        ctx.fillStyle = '#00FF00'; // green -> Start point.
    }
    else if (state == 'f') {
        ctx.fillStyle = '#FF0000'; // red -> End point.
    }
    else if(state == 'e') {
        ctx.fillStyle = '#AAAAAA'; // gray -> where to draw the wall | unvisited section.
    }
    else if (state == 'w') {
        ctx.fillStyle = '#0000FF'; // blue -> Draw the wall.
    }
    else if (state == 'x') {
        ctx.fillStyle = '#000000'; // black -> Tracking the fast path.
    }
    else {
        ctx.fillStyle = '#FFFF00'; // yellow -> check the path.
    }

    ctx.beginPath();
    ctx.rect(x,y,w,h);
    ctx.closePath();
    ctx.fill();
}

function clear() {
    ctx.clearRect(0,0,WIDTH,HEIGHT);
}

// draw Square
function draw() {
    clear();
    
    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            rect(tiles[c][r].x, tiles[c][r].y, tileW, tileH, tiles[c][r].state);
        }
    }
}

// Solve Maze Function
function mazeSolve() {
    var Xqueue = [0];
    var Yqueue = [0];

    var pathFound = false;

    var xLoc;
    var yLoc;

    while (Xqueue.length > 0 && !pathFound) {
        xLoc = Xqueue.shift();
        yLoc = Yqueue.shift();

        if (xLoc > 0) {
            if (tiles[xLoc-1][yLoc].state == 'f') {
                pathFound = true;           
            }
        }
        if (xLoc < tileColumnCount -1) {
            if (tiles[xLoc+1][yLoc].state == 'f') {
                pathFound = true;
            }
        }
        if (yLoc > 0) {
            if (tiles[xLoc][yLoc-1].state == 'f') {
                pathFound = true;           
            }
        }
        if (yLoc < tileRowCount -1) {
            if (tiles[xLoc][yLoc+1].state == 'f') {
                pathFound = true;
            }
        }
        // empty session
        if (xLoc > 0) {
            if (tiles[xLoc-1][yLoc].state == 'e') {
                Xqueue.push(xLoc-1);     
                Yqueue.push(yLoc);
                tiles[xLoc-1][yLoc].state = tiles[xLoc][yLoc].state + 'l'; // left     
            }
        }
        if (xLoc < tileColumnCount -1) {
            if (tiles[xLoc+1][yLoc].state == 'e') {
                Xqueue.push(xLoc+1);     
                Yqueue.push(yLoc);
                tiles[xLoc+1][yLoc].state = tiles[xLoc][yLoc].state + 'r'; // right
            }
        }
        if (yLoc > 0) {
            if (tiles[xLoc][yLoc-1].state == 'e') {
                Xqueue.push(xLoc);     
                Yqueue.push(yLoc-1);
                tiles[xLoc][yLoc-1].state = tiles[xLoc][yLoc].state + 'u'; // up         
            }
        }
        if (yLoc < tileRowCount -1) {
            if (tiles[xLoc][yLoc+1].state == 'e') {
                Xqueue.push(xLoc);     
                Yqueue.push(yLoc+1);
                tiles[xLoc][yLoc+1].state = tiles[xLoc][yLoc].state + 'd'; // down
            }
        }
    }
    if (!pathFound) {
        output.innerHTML = 'No solution for this Maze';
    }
    else {
        output.innerHTML = 'Maze solved';
        var path = tiles[xLoc][yLoc].state;
        var pathLength = path.length;
        var currX = 0;
        var currY = 0;
        for (var i = 0; i < pathLength-1; i++) {
            if (path.charAt(i+1) == 'u') {
                currY -=1;
            }
            if (path.charAt(i+1) == 'd') {
                currY +=1;
            }
            if (path.charAt(i+1) == 'r') {
                currX +=1;
            }
            if (path.charAt(i+1) == 'l') {
                currX +=1;
            }
            tiles[currX][currY].state = 'x';
        }
    }
}

// Reset Maze draw
function reset() {
    for (c = 0; c < tileColumnCount; c++) {
        tiles[c] = [];
        for (r = 0; r < tileRowCount; r++) {
            tiles[c][r] = {x: c*(tileW+3), y: r*(tileH+3), state: 'e'};
        }
    }
    tiles[0][0].state = 's';
    tiles[tileColumnCount-1][tileRowCount-1].state = 'f';

    output.innerHTML = '';
}

function init() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    output = document.getElementById("outcome");
    return setInterval(draw, 10);
}
// function to move mouse.
function myMove(e) {
    x = e.pageX - canvas.offsetLeft;
    y = e.pageY - canvas.offsetTop;

    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            if (c*(tileW+3) < x && x < c*(tileW+3)+tileW && r*(tileH+3) < y && y < r*(tileH+3)+ tileH) {
                // empty to wall
                if (tiles[c][r].state == 'e' && (c!= boundX || r != boundY)) {
                    tiles[c][r].state = 'w';
                    //Improvement
                    boundX = c;
                    boundY = r;
                }
                // wall to empty
                else if (tiles[c][r].state == 'w' && (c!= boundX || r != boundY)) {
                    tiles[c][r].state = 'e';
                    //Improvement
                    boundX = c;
                    boundY = r;
                }
            }    
        }
    }
}

// function to build the wall 
function myDown(e) {
    // don't click everytime just click once and make a wall | Improvement
    canvas.onmousemove = myMove;

    x = e.pageX - canvas.offsetLeft;
    y = e.pageY - canvas.offsetTop;

    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            if (c*(tileW+3) < x && x < c*(tileW+3)+tileW && r*(tileH+3) < y && y < r*(tileH+3)+ tileH) {
                // empty to wall
                if (tiles[c][r].state == 'e') {
                    tiles[c][r].state = 'w';
                    //Improvement
                    boundX = c;
                    boundY = r;
                }
                // wall to empty
                else if (tiles[c][r].state == 'w') {
                    tiles[c][r].state = 'e';
                    //Improvement
                    boundX = c;
                    boundY = r;
                }
            }    
        }
    }
}

function mouseUp() {
    canvas.onmousemove = null;
}

init();

// Start build the wall for the maze

canvas.onmousedown = myDown;   
canvas.onmouseup = mouseUp; 