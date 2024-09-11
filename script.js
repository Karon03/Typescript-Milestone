"use strict";
// Define types and enums
var Player;
(function (Player) {
    Player["X"] = "X";
    Player["O"] = "O";
})(Player || (Player = {}));
class TicTacToe {
    constructor() {
        this.cells = [];
        this.currentPlayer = Player.X;
        this.gameActive = true;
        this.playerXScore = 0;
        this.playerOScore = 0;
        this.tieScore = 0;
        this.gameBoard = document.getElementById('game-board');
        this.turnIndicator = document.getElementById('turn-indicator');
        this.modal = document.getElementById('modal');
        this.modalMessage = document.getElementById('modal-message');
        this.closeButton = document.querySelector('.close');
        this.resetButtons = document.querySelectorAll('.reset-button');
        this.initializeGame();
    }
    initializeGame() {
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            this.initializeCell(cell, i);
        }
        this.resetButtons.forEach(button => {
            button.addEventListener('click', () => this.resetGame());
        });
        this.closeButton.addEventListener('click', () => {
            this.modal.style.display = "none";
        });
        this.updateTurnIndicator();
    }
    initializeCell(cell, index) {
        cell.classList.add('cell');
        cell.dataset.index = index.toString();
        cell.addEventListener('click', () => this.handleCellClick(cell));
        this.gameBoard.appendChild(cell);
        this.cells.push(cell);
    }
    handleCellClick(cell) {
        if (this.gameActive && cell.textContent === '') {
            document.querySelector('.click-sound').play();
            cell.textContent = this.currentPlayer;
            cell.dataset.player = this.currentPlayer;
            cell.classList.add(this.currentPlayer);
            cell.classList.add('placed');
            if (this.checkWinner(this.currentPlayer)) {
                this.showModal(`Player ${this.currentPlayer} wins!`);
                this.gameActive = false;
                this.handleEndOfGame(this.currentPlayer);
            }
            else if (this.checkDraw()) {
                this.showModal("It's a draw!");
                this.gameActive = false;
                this.handleEndOfGame('tie');
            }
            else {
                this.currentPlayer = this.currentPlayer === Player.X ? Player.O : Player.X;
                this.updateTurnIndicator();
            }
        }
    }
    checkWinner(player) {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winningCombos.some(combo => combo.every(index => this.cells[index].textContent === player));
    }
    checkDraw() {
        return this.cells.every(cell => cell.textContent !== '');
    }
    resetGame() {
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove(Player.X, Player.O, 'placed');
            cell.removeAttribute('data-player');
        });
        this.currentPlayer = Player.X;
        this.gameActive = true;
        this.updateTurnIndicator();
    }
    updateTurnIndicator() {
        this.turnIndicator.textContent = `Player ${this.currentPlayer}'s Turn`;
    }
    showModal(message) {
        this.modal.style.display = "block";
        this.modalMessage.textContent = message;
    }
    handleEndOfGame(outcome) {
        switch (outcome) {
            case Player.X:
                this.playerXScore++;
                document.querySelector('.win-sound').play();
                break;
            case Player.O:
                this.playerOScore++;
                document.querySelector('.win-sound').play();
                break;
            case 'tie':
                this.tieScore++;
                break;
        }
        this.updateScores();
    }
    updateScores() {
        document.querySelector('.player-x-score').textContent = `Player X: ${this.playerXScore}`;
        document.querySelector('.player-o-score').textContent = `Player O: ${this.playerOScore}`;
        document.querySelector('.tie-score').textContent = `Ties: ${this.tieScore}`;
    }
}
// Initialize the game
new TicTacToe();
