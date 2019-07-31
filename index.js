/**
* This program is a boilerplate code for the standard tic tac toe game
* Here the “box” represents one placeholder for either a “X” or a “0”
* We have a 2D array to represent the arrangement of X or O is a grid
* 0 -> empty box
* 1 -> box with X
* 2 -> box with O
*
* Below are the tasks which needs to be completed:
* Imagine you are playing with the computer so every alternate move should be done by the computer
* X -> player -> 1
* O -> Computer -> 2
*
* Winner needs to be decided and has to be flashed
*
* Extra points will be given for approaching the problem more creatively
*
*/

var grid = [
  // [1,1,2],
  // [0,2,0],
  // [0,1,2]
];
const GRID_LENGTH = 3;
var turn = 'X';
var count = 0;
var gameFinish = 0;

function initializeGrid() {
    grid = []
    gameFinish = 0;
    turn = 'X';
    for (let colIdx = 0;colIdx < GRID_LENGTH; colIdx++) {
        const tempArray = [];
        for (let rowidx = 0; rowidx < GRID_LENGTH;rowidx++) {
            tempArray.push(0);
        }
        grid.push(tempArray);
    }
    count = 0;
}

function getRowBoxes(colIdx) {
    let rowDivs = '';

    for(let rowIdx=0; rowIdx < GRID_LENGTH ; rowIdx++ ) {
        let additionalClass = 'darkBackground';
        let content = '';
        const sum = colIdx + rowIdx;
        if (sum%2 === 0) {
            additionalClass = 'lightBackground'
        }
        const gridValue = grid[colIdx][rowIdx];
        if(gridValue === 1) {
            content = '<span class="cross">X</span>';
        }
        else if (gridValue === 2) {
            content = '<span class="cross">O</span>';
        }
        rowDivs = rowDivs + '<div colIdx="'+ colIdx +'" rowIdx="' + rowIdx + '" class="box ' +
            additionalClass + '">' + content + '</div>';
    }
    return rowDivs;
}

function getColumns() {
    let columnDivs = '';
    for(let colIdx=0; colIdx < GRID_LENGTH; colIdx++) {
        let coldiv = getRowBoxes(colIdx);
        coldiv = '<div class="rowStyle">' + coldiv + '</div>';
        columnDivs = columnDivs + coldiv;
    }
    return columnDivs;
}

function renderMainGrid() {
    const parent = document.getElementById("grid");
    const columnDivs = getColumns();
    parent.innerHTML = '<div class="columnsStyle">' + columnDivs + '</div>';
    document.getElementsByClassName('result')[0].innerText = '';
}

function onBoxClick() {
    var rowIdx = this.getAttribute("rowIdx");
    var colIdx = this.getAttribute("colIdx");
    if (grid[colIdx][rowIdx]){
      return 1;
    }
    if(count < 9){
      count = count + 1
      turn = 'O'
      grid[colIdx][rowIdx] = 1;
      renderMainGrid();
      addClickHandlers();
    }

    if(count < 9){ //add tie logic
      count = count + 1
      let move_ = bestMove(grid, 2, 1);

      turn = 'X'
      grid[move_.indexes[0]][move_.indexes[1]] = 2;
      renderMainGrid();
      addClickHandlers();
    }


    let result = checkWinner();
    if( result == 1){
      document.getElementsByClassName('result')[0].innerText = 'Player Wins';
      gameFinish = 1;
    }
    else if (result == 2) {
      document.getElementsByClassName('result')[0].innerText = 'Computer Wins';
      gameFinish = 1;
    }
    else if(count == 9) {
      document.getElementsByClassName('result')[0].innerText = 'Tie';
      gameFinish = 1;
    }

    if(gameFinish){
      removeClickHandlers();
    }
}

function evaluate(a,b, c){
  return (a == b && b == c && a != '');
}

function checkWinner() {
  winner = -1
  for(let i=0;i<GRID_LENGTH;i++){
      if(evaluate(grid[i][0], grid[i][1], grid[i][2])){
        winner = grid[i][0];
      }
  }

  for(let i=0;i<GRID_LENGTH;i++){
      if(evaluate(grid[0][i], grid[1][i], grid[2][i])){
        winner = grid[0][i];
      }
  }

  if(evaluate(grid[0][0], grid[1][1], grid[2][2])){
    winner = grid[0][0];
  }

  if(evaluate(grid[2][0], grid[1][1], grid[0][2])){
    winner = grid[2][0];
  }
  return winner;

}

function addClickHandlers() {
    var boxes = document.getElementsByClassName("box");
    for (var idx = 0; idx < boxes.length; idx++) {
        boxes[idx].addEventListener('click', onBoxClick, false);
    }
}

function removeClickHandlers() {
    var boxes = document.getElementsByClassName("box");
    for (var idx = 0; idx < boxes.length; idx++) {
        boxes[idx].removeEventListener('click', onBoxClick, false);
    }
}

function emptyBoxes(_grid) {
  let emptyList = []
  for (let colIdx = 0;colIdx < GRID_LENGTH; colIdx++) {
      for (let rowidx = 0; rowidx < GRID_LENGTH;rowidx++) {
          if(!_grid[colIdx][rowidx]) {
            emptyList.push([colIdx, rowidx])
          }
      }
  }
  return emptyList;
}

function bestMove(board, value, factor) { // factor for depth wise score decrease
  let empty = emptyBoxes(board);
  if(checkWinner() == 1) {
    return {score:-10*factor};
  }
  else if (checkWinner() == 2) {
    return {score:30*factor}
  }
  else if (empty.length === 0) {
    return {score:0*factor};
  }
  let moves = [];
  for(let i=0;i<empty.length;i++){
    var move = {};
    move.value = board[empty[i][0]][empty[i][1]];
    move.indexes = []
    move.indexes.push(empty[i][0]);
    move.indexes.push(empty[i][1]);
    board[empty[i][0]][empty[i][1]] = value;
    if( value == 1){
      var result_ = bestMove(board, 2, factor-factor*1/10);
      move.score = result_.score;
    }
    else {
      var result_ = bestMove(board, 1, factor-factor*1/10);
      move.score = result_.score
    }
    board[empty[i][0]][empty[i][1]] = move.value;
    moves.push(move);
  }
  let bestmove;
  if( value == 1){
    let bestScore = Number.POSITIVE_INFINITY;
    for(let j = 0; j< moves.length;j++){
      if(moves[j].score < bestScore) {
        bestScore = moves[j].score;
        bestmove = j
      }
    }
  }
  else {
    let bestScore = Number.NEGATIVE_INFINITY;
    for(let j = 0; j< moves.length;j++){
      if(moves[j].score > bestScore) {
        bestScore = moves[j].score;
        bestmove = j
      }
    }
  }
  return moves[bestmove];
}

function initialize(){
  initializeGrid();
  renderMainGrid();
  addClickHandlers();
}

initialize();
