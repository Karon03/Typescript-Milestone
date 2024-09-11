document.addEventListener("DOMContentLoaded", function () {

    const gameBoard = document.getElementById('game-board');
    const cells = [];
    const turnIndicator = document.getElementById('turn-indicator');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const closeButton = document.querySelector('.close');

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(cell));
        gameBoard.appendChild(cell);
        cells.push(cell);
    }

    const resetButtons = document.querySelectorAll('.reset-button');
    resetButtons.forEach(button => {
        button.addEventListener('click', resetGame);
    });

    let currentPlayer = 'X';
    let gameActive = true;
    let playerXScore = 0;
    let playerOScore = 0;
    let tieScore = 0;

    function handleCellClick(cell) {

        if (gameActive && cell.textContent === '') {
            document.querySelector('.click-sound').play();
            cell.textContent = currentPlayer;
            cell.dataset.player = currentPlayer;
            cell.classList.add(currentPlayer);
            cell.classList.add('placed');

            if (checkWinner(currentPlayer)) {
                showModal(`Player ${currentPlayer} wins!`);
                gameActive = false;
                handleEndOfGame(currentPlayer);
            } else if (checkDraw()) {
                showModal("It's a draw!");
                gameActive = false;
                handleEndOfGame('tie');
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateTurnIndicator();
            }
        }
    }

    function checkWinner(player) {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winningCombos.some(combo => {
            return combo.every(index => {
                return cells[index].textContent === player;
            });
        });
    }

    function checkDraw() {

        return [...cells].every(cell => cell.textContent !== '');
    }

    function resetGame() {

        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('X', 'O', 'placed');
            cell.removeAttribute('data-player');
        });
        currentPlayer = 'X';
        gameActive = true;
        updateTurnIndicator();
    }

    function updateTurnIndicator() {
        turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
    }

    function showModal(message) {
        modal.style.display = "block";
        modalMessage.textContent = message;
    }

    function handleEndOfGame(outcome) {
        switch (outcome) {
            case 'X':
                playerXScore++;
                document.querySelector('.win-sound').play();
                break;
            case 'O':
                playerOScore++;
                document.querySelector('.win-sound').play();
                break;
            case 'tie':
                tieScore++;
                break;
            default:
                break;
        }
        updateScores();
    }


    function updateScores() {
        document.querySelector('.player-x-score').textContent = `Player X: ${playerXScore}`;
        document.querySelector('.player-o-score').textContent = `Player O: ${playerOScore}`;
        document.querySelector('.tie-score').textContent = `Ties: ${tieScore}`;
    }


    closeButton.addEventListener('click', () => {
        modal.style.display = "none";
    });
});