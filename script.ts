enum Player {
    X = 'X',
    O = 'O'
}

type GameOutcome = Player | 'tie';

interface CellElement extends HTMLElement {
    dataset: DOMStringMap & { index: string; player?: Player };
    textContent: string | null;
}

class TicTacToe {
    private gameBoard: HTMLElement;
    private cells: CellElement[] = [];
    private turnIndicator: HTMLElement;
    private modal: HTMLElement;
    private modalMessage: HTMLElement;
    private closeButton: HTMLElement;
    private resetButtons: NodeListOf<HTMLElement>;

    private currentPlayer: Player = Player.X;
    private gameActive: boolean = true;
    private playerXScore: number = 0;
    private playerOScore: number = 0;
    private tieScore: number = 0;

    constructor() {
        this.gameBoard = document.getElementById('game-board')!;
        this.turnIndicator = document.getElementById('turn-indicator')!;
        this.modal = document.getElementById('modal')!;
        this.modalMessage = document.getElementById('modal-message')!;
        this.closeButton = document.querySelector('.close')!;
        this.resetButtons = document.querySelectorAll('.reset-button') as NodeListOf<HTMLElement>;

        this.initializeGame();
    }

    private initializeGame(): void {
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

    private initializeCell(cell: HTMLElement, index: number): void {
        cell.classList.add('cell');
        cell.dataset.index = index.toString();
        cell.addEventListener('click', () => this.handleCellClick(cell as CellElement));
        this.gameBoard.appendChild(cell as CellElement);
        this.cells.push(cell as CellElement);
    }

    private handleCellClick(cell: CellElement): void {
        if (this.gameActive && cell.textContent === '') {
            (document.querySelector('.click-sound') as HTMLAudioElement).play();
            cell.textContent = this.currentPlayer;
            cell.dataset.player = this.currentPlayer;
            cell.classList.add(this.currentPlayer);
            cell.classList.add('placed');

            if (this.checkWinner(this.currentPlayer)) {
                this.showModal(`Player ${this.currentPlayer} wins!`);
                this.gameActive = false;
                this.handleEndOfGame(this.currentPlayer);
            } else if (this.checkDraw()) {
                this.showModal("It's a draw!");
                this.gameActive = false;
                this.handleEndOfGame('tie');
            } else {
                this.currentPlayer = this.currentPlayer === Player.X ? Player.O : Player.X;
                this.updateTurnIndicator();
            }
        }
    }

    private checkWinner(player: Player): boolean {
        const winningCombos: number[][] = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winningCombos.some(combo => combo.every(index => this.cells[index].textContent === player));
    }

    private checkDraw(): boolean {
        return this.cells.every(cell => cell.textContent !== '');
    }

    private resetGame(): void {
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove(Player.X, Player.O, 'placed');
            cell.removeAttribute('data-player');
        });
        this.currentPlayer = Player.X;
        this.gameActive = true;
        this.updateTurnIndicator();
    }

    private updateTurnIndicator(): void {
        this.turnIndicator.textContent = `Player ${this.currentPlayer}'s Turn`;
    }

    private showModal(message: string): void {
        this.modal.style.display = "block";
        this.modalMessage.textContent = message;
    }

    private handleEndOfGame(outcome: GameOutcome): void {
        switch (outcome) {
            case Player.X:
                this.playerXScore++;
                (document.querySelector('.win-sound') as HTMLAudioElement).play();
                break;
            case Player.O:
                this.playerOScore++;
                (document.querySelector('.win-sound') as HTMLAudioElement).play();
                break;
            case 'tie':
                this.tieScore++;
                break;
        }
        this.updateScores();
    }

    private updateScores(): void {
        document.querySelector('.player-x-score')!.textContent = `Player X: ${this.playerXScore}`;
        document.querySelector('.player-o-score')!.textContent = `Player O: ${this.playerOScore}`;
        document.querySelector('.tie-score')!.textContent = `Ties: ${this.tieScore}`;
    }
}

// Initialize the game
new TicTacToe();
