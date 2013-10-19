d = document;

window.requestAnimFrame = (function(){                    //usage: requestAnimFrame(function); 
  return  window.requestAnimationFrame       ||           //will make a browser appropriate request to run function 
          window.webkitRequestAnimationFrame ||           //at the next available animated frame. good for battery
          window.mozRequestAnimationFrame    ||           //saving by stopping rendering when tab loses view
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function matrix( rows, cols, defaultValue){               //usage: varName = matrix (16, 10, 0); 
                                                          //will create a 2 dimensional array of rows and columns
  var arr = [];                                           //filled with default value

  // Creates all lines:
  for(var i=0; i < rows; i++){

      // Creates an empty line
      arr.push([]);

      // Adds cols to the empty line:
      arr[i].push( new Array(cols));

      for(var j=0; j < cols; j++){
        // Initializes:
        arr[i][j] = defaultValue;
      }
  }

return arr;
}

function drawBlox(x, y, color) {                        //draws some blox
   var c = document.getElementById("myCanvas");
   var ctx = c.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(40 * x, 40 * y, 40, 40);
}

document.onkeydown = checkKey;                           //arrow keypress handler

function checkKey(e) {
  e = e || window.event;
  if (nowPlaying == 1) {
    if (e.keyCode == '38') {               //up
      turnThePiece();
    } else if (e.keyCode == '40') {        //down
      dropSlow = 0;
    } else if (e.keyCode == '37') {        //left
      moveThePiece(-1);
    } else if (e.keyCode == '39') {        //right
      moveThePiece(+1);
    }
  }
}

function dropIt () { dropSlow = 0 } //for the mobile button ok

function turnThePiece () {
  var ccc = (pieceShape[0].length); // kept getting this mixed up
  var rrr = (pieceShape.length);
  var checkPiece = matrix(ccc, rrr, 0);
    var newRow = 0;
    for (var oldColumn = ccc - 1; oldColumn >= 0; oldColumn--)
    {
        var newColumn = 0;
        for (var oldRow = 0; oldRow < rrr; oldRow++)
        {
            checkPiece[newRow][newColumn] = pieceShape[oldRow][oldColumn];
            newColumn++;
        }
        newRow++;
    }
    
  if (checkThePiece(pieceX, pieceY, checkPiece) == 1) {  
    pieceShape = checkPiece;
    requestAnimFrame(renderGame);
  }
}

function checkThePiece(checkX, checkY, checkingPiece) {
try {
  for (var row = 0; row < checkingPiece.length; row++) {
    for (var col = 0; col < checkingPiece[row].length; col++) {
      if (checkingPiece[row][col] != 0) {
        if (board[row + checkY][col + checkX] != 0) {        
          return 0;
        }
        if (row + checkY >= 16) {return 0;}  
      }
    }
  }
  return 1;
}
catch (err) {nowPlaying = 0;}

}
function moveThePiece(testX) {
  var checkX = pieceX + testX;
  var checkY = pieceY;
  if (checkThePiece(checkX, checkY, pieceShape) == 1) {  
    pieceX += testX;
    requestAnimFrame(renderGame);
  }
}



function makeNewPiece() {
  var rand = 1 * (Math.floor(Math.random() * 7) + 1); //pick a random piece
  if (rand == 1) {pieceShape = matrix(2,2,1) };                                              //o block
  if (rand == 2) {pieceShape = matrix(4,4,0); pieceShape[0][1] = 2; pieceShape[1][1] = 2; pieceShape[2][1] = 2; pieceShape[3][1] = 2; };//tall block
  if (rand == 3) {pieceShape = matrix(3,2,3); pieceShape[0][1] = 0; pieceShape[1][1] = 0; }; //L block1
  if (rand == 4) {pieceShape = matrix(3,2,4); pieceShape[0][0] = 0; pieceShape[1][0] = 0; }; //J block 
  if (rand == 5) {pieceShape = matrix(2,3,5); pieceShape[0][0] = 0; pieceShape[1][2] = 0; }; //Z block
  if (rand == 6) {pieceShape = matrix(2,3,6); pieceShape[0][2] = 0; pieceShape[1][0] = 0; }; //S block
  if (rand == 7) {pieceShape = matrix(2,3,7); pieceShape[1][0] = 0; pieceShape[1][2] = 0; }; //T block
  newPiece = 0;
  dropSlow = 1;
  pieceX = 4;
  pieceY = -1;
  piceRot = 0;
}

function dropThePiece() {
  var checkX = pieceX;
  var checkY = pieceY + 1;
  if (checkThePiece(checkX, checkY, pieceShape) == 0)
   {newPiece = 1; dropSlow = 0; putThePieceDown(); return 0;}
}

function renderGame() {
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 400, 640); //clear the canvas

  for (var row = 0; row < board.length; row++) {
    for (var col = 0; col < board[row].length; col++) {
      if (board[row][col] != 0) {
        var aColor = board[row][col];
        if (aColor == 1) {var color = "#2C3E50"}
        if (aColor == 2) {var color = "#FC4349"}
        if (aColor == 3) {var color = "#6DBCDB"}
        if (aColor == 4) {var color = "#3DBB7E"}
        if (aColor == 5) {var color = "#A3CD39"}
        if (aColor == 6) {var color = "#FBAC1D"}
        if (aColor == 7) {var color = "#F96C1E"}
        drawBlox(col,row, color);
        //remember, row gives y-position, col gives x-position
      }
    }
  }
  
  for (var row = 0; row < pieceShape.length; row++) {
    for (var col = 0; col < pieceShape[row].length; col++) {
      if (pieceShape[row][col] != 0) {

      if (col + pieceX > 9) {pieceX -= 1; renderGame(); return 0;}
      if (col + pieceX < 0) {pieceX += 1; renderGame(); return 0;} 
        var aColor = pieceShape[row][col];
        if (aColor == 1) {var color = "#2C3E50"}
        if (aColor == 2) {var color = "#FC4349"}
        if (aColor == 3) {var color = "#6DBCDB"}
        if (aColor == 4) {var color = "#3DBB7E"}
        if (aColor == 5) {var color = "#A3CD39"}
        if (aColor == 6) {var color = "#FBAC1D"}
        if (aColor == 7) {var color = "#F96C1E"}
        drawBlox(col + pieceX, row + pieceY, color);
      }
    }
  }

}

function putThePieceDown () {
try {
  for (var row = 0; row < pieceShape.length; row++) {
    for (var col = 0; col < pieceShape[row].length; col++) {
      if (pieceShape[row][col] != 0) {
        board[row + pieceY][col + pieceX] = pieceShape[row][col];
      }
    }
  }
  checkFullRows();
}
catch (err) {nowPlaying = 0;}
}

function checkFullRows() {
var rowsCleared = 0;
for (var row = 0; row < board.length; row++) {
    isFilled = true;
    for (var col = 0; col < board[row].length; col++) {
        if (board[row][col] == 0) {
            isFilled = false;
        }
    }
    
    if (isFilled == true) {
    rowsCleared += 1;
    board.splice(row, 1);  
    board.unshift([0,0,0,0,0,0,0,0,0,0]);   
    }
}
if (rowsCleared !=0) { doScores(rowsCleared); }
}

function doScores(clear) {

  var points = 0;
  if (clear == 1) {points = 40;}
  if (clear == 2) {points = 100;}
  if (clear == 3) {points = 300;}
  if (clear == 4) {points = 1200;}
  nextLevel += clear;
  theLevel = Math.floor(nextLevel/10);
  score += (points * (theLevel +1));
  document.getElementById('level').innerHTML = "level: " + theLevel;
  document.getElementById('score').innerHTML = "score: " + score;

}

function newGame() {
  board = matrix(17, 10, 0);
  score = 0;
  nowPlaying = 1;
  newPiece = 1;
  theLevel = 0;
  nextLevel = 0;
  mainLoop ();
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 400, 640); //clear the canvas
    document.body.className = "playing";
}

function mainLoop() {
  pressPerLoop = 0;
  if (newPiece == 1) {makeNewPiece()};
  dropThePiece();
  requestAnimFrame(renderGame);
  if (nowPlaying == 1) {
  pieceY += 1;
    setTimeout( mainLoop, ((800-(50*theLevel)) * dropSlow));
  } else {document.body.className = "gg";}
}

d.addEventListener("DOMContentLoaded", function () { // Initial setup on page load
  d.removeEventListener("DOMContentLoaded", arguments.callee, false);
newGame();  
});


