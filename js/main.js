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

function checkThePiece(checkX, checkY, checkingPiece) {                  //a simple function to check if where we want the piece to go makes sense
  for (var row = 0; row < checkingPiece.length; row++) {                 //accepts future coordinates and piece shape to check for new location and
    for (var col = 0; col < checkingPiece[row].length; col++) {          //rotation posibilities. returns 1 if legal move otherwise 0
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

function turnThePiece () {          //clockwise rotation of a 2d array of any dimensions
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

function moveThePiece(testX) {          //lateral movement of the piece. called on arrow key presses
  var checkX = pieceX + testX;
  var checkY = pieceY;
  if (checkThePiece(checkX, checkY, pieceShape) == 1) {  
    pieceX += testX;
    requestAnimFrame(renderGame);
  }
}

function dropThePiece() {              //vertical movement of the piece. called on set interval defined in main loop
  var checkX = pieceX;
  var checkY = pieceY + 1;
  if (checkThePiece(checkX, checkY, pieceShape) == 0)
   {newPiece = 1; dropSlow = 0; putThePieceDown(); return 0;}
}

function makeNewPiece() {              //creates a new piece at game start or once one becomes attached to the board
  var aColor1 = "#2C3E50";             //define our piece colors in standard hex notation
  var aColor2 = "#FC4349";
  var aColor3 = "#6DBCDB";
  var aColor4 = "#3DBB7E";
  var aColor5 = "#A3CD39";
  var aColor6 = "#FBAC1D";
  var aColor7 = "#F96C1E";

  var rand = 1 * (Math.floor(Math.random() * 7) + 1);                                             //pick a random piece
  if (rand == 1) {pieceShape = matrix(2,2,aColor1) };                                                         //o block
  if (rand == 2) {pieceShape = matrix(4,4,0); pieceShape[0][1] = aColor2;            //empty square so it rotates right
  pieceShape[1][1] = aColor2; pieceShape[2][1] = aColor2; pieceShape[3][1] = aColor2; };                   //tall block
  if (rand == 3) {pieceShape = matrix(3,2,aColor3); pieceShape[0][1] = 0; pieceShape[1][1] = 0; };           //L block1
  if (rand == 4) {pieceShape = matrix(3,2,aColor4); pieceShape[0][0] = 0; pieceShape[1][0] = 0; };            //J block 
  if (rand == 5) {pieceShape = matrix(2,3,aColor5); pieceShape[0][0] = 0; pieceShape[1][2] = 0; };            //Z block
  if (rand == 6) {pieceShape = matrix(2,3,aColor6); pieceShape[0][2] = 0; pieceShape[1][0] = 0; };            //S block
  if (rand == 7) {pieceShape = matrix(2,3,aColor7); pieceShape[1][0] = 0; pieceShape[1][2] = 0; };            //T block
  newPiece = 0;
  dropSlow = 1;
  pieceX = 4;
  pieceY = -1;
  piceRot = 0;
}

function putThePieceDown () {                                     //attaches the moving piece to the board when it can no longer move down
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

function checkFullRows() {                                        //checks for completed rows. called when a piece is attached to the board
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

function doScores(clear) {                                       //calculates score from cleared rows. called when rows are cleared

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

function renderGame() {                 // rendering function! loops through board and piece states and draws them to canvas
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 400, 640); //clear the canvas

  for (var row = 0; row < board.length; row++) {
    for (var col = 0; col < board[row].length; col++) {
      if (board[row][col] != 0) {
        var aColor = board[row][col];
        drawBlox(col,row, aColor);
      }
    }
  }
  
  for (var row = 0; row < pieceShape.length; row++) {
    for (var col = 0; col < pieceShape[row].length; col++) {
      if (pieceShape[row][col] != 0) {

      if (col + pieceX > 9) {pieceX -= 1; renderGame(); return 0;}
      if (col + pieceX < 0) {pieceX += 1; renderGame(); return 0;} 
        var aColor = pieceShape[row][col];
        drawBlox(col + pieceX, row + pieceY, aColor);
      }
    }
  }

}

function newGame() {                          //initializes a clean game state. called on page load and when new game is pressed
  board = matrix(17, 10, 0);
  score = 0;
  nowPlaying = 1;
  newPiece = 1;
  theLevel = 0;
  nextLevel = 0;
  document.getElementById('level').innerHTML = "level: " + theLevel;
  document.getElementById('score').innerHTML = "score: " + score;
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

d.addEventListener("DOMContentLoaded", function () {                    // once page is loaded, call newgame!
  d.removeEventListener("DOMContentLoaded", arguments.callee, false);
newGame();  
});
