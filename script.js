const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('#status');
const resetButton = document.querySelector('#reset');
 
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let humanPlayer = 'X';
let devicePlayer = 'O';
let currentPlayer = humanPlayer;
 
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
 
function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedIndex = Number(clickedCell.dataset.index);
 
  if (gameActive === false) {
    return;
  }
 
  if (currentPlayer !== humanPlayer) {
    return;
  }
 
  if (board[clickedIndex] !== '') {
    return;
  }
 
  makeMove(clickedIndex, humanPlayer);
 
  if (checkResult() === true) {
    return;
  }
 
  currentPlayer = devicePlayer;
  statusText.textContent = 'Device is thinking...';
 
  setTimeout(function() {
    makeDeviceMove();
  }, 500);
}
 
function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].disabled = true;
}
 
function makeDeviceMove() {
  if (gameActive === false) {
    return;
  }
 
  const move = chooseDeviceMove();
 
  if (move === null) {
    return;
  }
 
  makeMove(move, devicePlayer);
 
  if (checkResult() === true) {
    return;
  }
 
  currentPlayer = humanPlayer;
  statusText.textContent = 'Your turn. You are X.';
}
 
function chooseDeviceMove() {
  let winningMove = findBestMove(devicePlayer);
 
  if (winningMove !== null) {
    return winningMove;
  }
 
  let blockingMove = findBestMove(humanPlayer);
 
  if (blockingMove !== null) {
    return blockingMove;
  }
 
  if (board[4] === '') {
    return 4;
  }
 
  const corners = [0, 2, 6, 8];
  const openCorner = corners.find(function(index) {
    return board[index] === '';
  });
 
  if (openCorner !== undefined) {
    return openCorner;
  }
 
  return findFirstOpenSquare();
}
 
function findBestMove(player) {
  for (let i = 0; i < winningCombinations.length; i++) {
    const combination = winningCombinations[i];
    const first = combination[0];
    const second = combination[1];
    const third = combination[2];
 
    const values = [board[first], board[second], board[third]];
    const playerCount = values.filter(function(value) {
      return value === player;
    }).length;
    const emptyCount = values.filter(function(value) {
      return value === '';
    }).length;
 
    if (playerCount === 2 && emptyCount === 1) {
      const emptyPosition = values.indexOf('');
      return combination[emptyPosition];
    }
  }
 
  return null;
}
 
function findFirstOpenSquare() {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      return i;
    }
  }
 
  return null;
}
 
function checkResult() {
  let roundWon = false;
  let winningCells = [];
 
  for (let i = 0; i < winningCombinations.length; i++) {
    const combination = winningCombinations[i];
    const a = board[combination[0]];
    const b = board[combination[1]];
    const c = board[combination[2]];
 
    if (a === '' || b === '' || c === '') {
      continue;
    }
 
    if (a === b && b === c) {
      roundWon = true;
      winningCells = combination;
      break;
    }
  }
 
  if (roundWon === true) {
    if (currentPlayer === humanPlayer) {
      statusText.textContent = 'You win!';
    } else {
      statusText.textContent = 'Device wins!';
    }
 
    gameActive = false;
    highlightWinningCells(winningCells);
    disableAllCells();
    return true;
  }
 
  if (!board.includes('')) {
    statusText.textContent = 'It is a draw!';
    gameActive = false;
    return true;
  }
 
  return false;
}
 
function highlightWinningCells(winningCells) {
  winningCells.forEach(function(index) {
    cells[index].classList.add('winner');
  });
}
 
function disableAllCells() {
  cells.forEach(function(cell) {
    cell.disabled = true;
  });
}
 
function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = humanPlayer;
  statusText.textContent = 'Your turn. You are X.';
 
  cells.forEach(function(cell) {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.remove('winner');
  });
}
 
cells.forEach(function(cell) {
  cell.addEventListener('click', handleCellClick);
});
 
resetButton.addEventListener('click', resetGame);
resetGame();
