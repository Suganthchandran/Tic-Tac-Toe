const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset');
const helpButton = document.getElementById('help');
const cells = Array.from(document.getElementsByClassName('cell'));
const playerForm = document.getElementById('player-form');
const startGameButton = document.getElementById('start-game');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const pointsToWinSelect = document.getElementById('points-to-win');
const player1ScoreElement = document.getElementById('player1-score');
const player2ScoreElement = document.getElementById('player2-score');
const instructionsModal = document.getElementById('instructions-modal');
const closeInstructionsBtn = document.getElementById('close-instructions');
const endGameModal = document.getElementById('end-game-modal');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let isGameOver = false;
let player1 = '';
let player2 = '';
let player1Score = 0;
let player2Score = 0;
let pointsToWin = 1;
let round = 0;

startGameButton.addEventListener('click', () => {
    player1 = player1Input.value || 'Player 1';
    player2 = player2Input.value || 'Player 2';
    pointsToWin = parseInt(pointsToWinSelect.value);
    playerForm.style.display = 'none';
    updateScores();
    initGame();
});

function updateScores() {
    player1ScoreElement.textContent = `${player1} (X): ${player1Score}`;
    player2ScoreElement.textContent = `${player2} (O): ${player2Score}`;
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], combination };
        }
    }

    if (!board.includes('')) {
        return { winner: 'Draw' };
    }

    return null;
}

function drawWinningLine(combination) {
    const winningLine = document.createElement('div');
    winningLine.classList.add('winning-line');

    const [a, b, c] = combination;
    const cellA = cells[a];
    const cellB = cells[b];
    const cellC = cells[c];

    const rectA = cellA.getBoundingClientRect();
    const rectB = cellB.getBoundingClientRect();
    const rectC = cellC.getBoundingClientRect();

    const centerA = { x: rectA.left + rectA.width / 2, y: rectA.top + rectA.height / 2 };
    const centerB = { x: rectB.left + rectB.width / 2, y: rectB.top + rectB.height / 2 };
    const centerC = { x: rectC.left + rectC.width / 2, y: rectC.top + rectC.height / 2 };

    const angle = Math.atan2(centerC.y - centerA.y, centerC.x - centerA.x) * 180 / Math.PI;
    const length = Math.sqrt(Math.pow(centerC.x - centerA.x, 2) + Math.pow(centerC.y - centerA.y, 2));

    winningLine.style.width = `${length}px`;
    winningLine.style.transform = `rotate(${angle}deg)`;
    winningLine.style.top = `${centerA.y}px`;
    winningLine.style.left = `${centerA.x}px`;

    document.body.appendChild(winningLine);
}

function handleClick(event) {
    if (isGameOver) return;

    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '') return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.style.color = currentPlayer === 'X' ? 'green' : 'orange';

    const result = checkWinner();

    if (result) {
        if (result.winner === 'Draw') {
            statusElement.textContent = 'It\'s a Draw!';
        } else {
            statusElement.textContent = `${result.winner} wins!`;
            if (result.winner === 'X') {
                player1Score++;
            } else {
                player2Score++;
            }
            updateScores();
            drawWinningLine(result.combination);
            if (player1Score >= pointsToWin || player2Score >= pointsToWin) {
                statusElement.textContent = `${result.winner === 'X' ? player1 : player2} wins the game!`;
                isGameOver = true;
                setTimeout(showEndGameModal, 2000); // Show modal after 2 seconds
                return;
            } else {
                isGameOver = true;
                setTimeout(() => {
                    round++;
                    initGame();
                }, 2000); // Reset the board after 2 seconds
                return;
            }
        }
        isGameOver = true;
        setTimeout(initGame, 2000); // Reset the board after 2 seconds
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusElement.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function initGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameOver = false;
    currentPlayer = round % 2 === 0 ? 'X' : 'O';
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.color = 'black';
        cell.classList.remove('win');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick);
    });

    const existingWinningLine = document.querySelector('.winning-line');
    if (existingWinningLine) {
        existingWinningLine.remove();
    }
}

function showEndGameModal() {
    endGameModal.style.display = 'flex';
}

yesBtn.addEventListener('click', () => {
    location.reload();
});

noBtn.addEventListener('click', () => {
    window.close();
});

resetButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to end the game?')) {
        playerForm.style.display = 'flex';
        player1Score = 0;
        player2Score = 0;
        round = 0;
        updateScores();
        initGame();
    }
});

helpButton.addEventListener('click', () => {
    instructionsModal.style.display = 'flex';
});

closeInstructionsBtn.addEventListener('click', () => {
    instructionsModal.style.display = 'none';
});


initGame();