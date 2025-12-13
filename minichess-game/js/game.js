// game.js - Main game controller with complete Game Rules Implementation

class MiniChessGame {
    constructor() {
        this.board = new Board();
        this.ui = new GameUI();
        this.ai = new AIPlayer(2);
        
        this.isWhiteTurn = true;
        this.gameMode = 'human-ai';
        this.playerColor = 'white';
        this.gameOver = false;
        this.isCheck = false;
        this.isCheckmate = false;
        this.moveHistory = [];
        this.thinking = false;
        this.showSettings = true;
        this.showAbout = false;

        this.initializeEventListeners();
        this.startNewGame();
    }

    initializeEventListeners() {
        document.getElementById('newGameBtn').addEventListener('click', () => this.startNewGame());
        document.getElementById('undoBtn').addEventListener('click', () => this.undoMove());
        document.getElementById('settingsBtn').addEventListener('click', () => this.toggleSettings());
        document.getElementById('aboutBtn').addEventListener('click', () => this.toggleAbout());
        
        document.getElementById('gameModeSelect').addEventListener('change', (e) => {
            this.gameMode = e.target.value;
            this.ui.updateSettingsVisibility(this.gameMode);
        });
        
        document.getElementById('playerColorSelect').addEventListener('change', (e) => {
            this.playerColor = e.target.value;
        });
        
        document.getElementById('aiDifficultySelect').addEventListener('change', (e) => {
            this.ai.setDifficulty(parseInt(e.target.value));
        });

        document.getElementById('resetModeBtn').addEventListener('click', () => {
            this.resetGameMode();
        });
    }

    startNewGame() {
        this.board.reset();
        this.isWhiteTurn = true;
        this.gameOver = false;
        this.isCheck = false;
        this.isCheckmate = false;
        this.moveHistory = [];
        this.thinking = false;
        
        this.ui.clearSelection();
        this.ui.clearStatusMessage();
        this.updateDisplay();
        
        // Check if AI should move first
        if ((this.gameMode === 'human-ai' && this.playerColor === 'black') ||
            this.gameMode === 'ai-ai') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    resetGameMode() {
        // Reset to default settings
        this.gameMode = 'human-ai';
        this.playerColor = 'white';
        this.ai.setDifficulty(2);
        
        // Update UI
        document.getElementById('gameModeSelect').value = 'human-ai';
        document.getElementById('playerColorSelect').value = 'white';
        document.getElementById('aiDifficultySelect').value = '2';
        this.ui.updateSettingsVisibility(this.gameMode);
        
        // Start new game with reset settings
        this.startNewGame();
    }

    handleSquareClick(row, col) {
        if (this.gameOver || this.thinking) return;

        // In human vs AI mode, only allow clicks on player's turn
        if (this.gameMode === 'human-ai' && 
            this.isWhiteTurn !== (this.playerColor === 'white')) {
            return;
        }

        const piece = this.board.getPiece(row, col);

        // If a square is already selected
        if (this.ui.selectedSquare) {
            const isLegalMove = this.ui.legalMoves.some(
                move => move.row === row && move.col === col
            );

            if (isLegalMove) {
                this.executeMove(
                    this.ui.selectedSquare.row,
                    this.ui.selectedSquare.col,
                    row,
                    col
                );
            }
            
            this.ui.clearSelection();
            this.updateDisplay();
        } 
        // Select a piece
        else if (piece && this.board.isCurrentPlayerPiece(piece, this.isWhiteTurn)) {
            this.ui.setSelectedSquare(row, col);
            const legalMoves = PieceMovement.getLegalMoves(this.board, row, col);
            this.ui.setLegalMoves(legalMoves);
            this.updateDisplay();
        }
    }

    executeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board.getPiece(fromRow, fromCol);
        const captured = this.board.makeMove(fromRow, fromCol, toRow, toCol);
        
        // Add to history
        this.moveHistory.push({
            piece: piece,
            captured: captured,
            notation: this.ui.getMoveNotation(fromRow, fromCol, toRow, toCol),
            boardState: this.board.clone()
        });

        // Check game state with proper termination conditions
        this.checkGameStateWithRules();

        // AI move in appropriate modes
        if (!this.gameOver) {
            if (this.gameMode === 'human-ai' || this.gameMode === 'ai-ai') {
                setTimeout(() => this.makeAIMove(), 300);
            }
        }
    }

    async makeAIMove() {
        if (this.gameOver || this.thinking) return;

        const shouldMove = (this.gameMode === 'ai-ai') ||
                          (this.gameMode === 'human-ai' && 
                           this.isWhiteTurn !== (this.playerColor === 'white'));

        if (!shouldMove) return;

        this.thinking = true;
        this.ui.showThinking(true);

        try {
            const move = await (this.gameMode === 'ai-ai' ? 
                this.ai.getMoveForAIvsAI(this.board, this.isWhiteTurn) :
                this.ai.makeMove(this.board, this.isWhiteTurn));

            if (move) {
                this.executeMove(
                    move.from.row,
                    move.from.col,
                    move.to.row,
                    move.to.col
                );
            } else {
                // No legal moves available
                this.gameOver = true;
                const winner = this.isWhiteTurn ? 'black' : 'white';
                this.ui.showGameOverMessage(winner, false);
            }
        } finally {
            this.thinking = false;
            this.ui.showThinking(false);
            this.updateDisplay();
        }
    }

    /**
     * GAME RULES AND TERMINATION CONDITIONS IMPLEMENTATION
     * 
     * This method implements the three core game rules:
     * 1. King Capture - Immediate game end
     * 2. Check Detection - Must be resolved
     * 3. Checkmate - Winner declaration
     */
    checkGameStateWithRules() {
        const currentPlayer = this.isWhiteTurn ? 'white' : 'black';
        
        // RULE 1: Check if King is captured - Game ends immediately
        if (BoardEvaluation.isGameOver(this.board)) {
            this.gameOver = true;
            const winner = BoardEvaluation.getWinner(this.board);
            
            // Display winner message for King capture
            if (winner === 'white') {
                this.ui.showWinnerMessage('White wins! Black King captured.');
            } else if (winner === 'black') {
                this.ui.showWinnerMessage('Black wins! White King captured.');
            }
            return;
        }

        // Switch turns
        this.isWhiteTurn = !this.isWhiteTurn;
        const nextIsWhite = this.isWhiteTurn;
        const nextPlayer = nextIsWhite ? 'white' : 'black';

        // RULE 2: Check if next player's King is in check
        const inCheck = PieceMovement.isInCheck(this.board, nextIsWhite);
        const hasLegalMoves = PieceMovement.getAllLegalMoves(this.board, nextIsWhite).length > 0;

        if (inCheck && !hasLegalMoves) {
            // RULE 3: Checkmate - Game ends with winner declaration
            this.isCheckmate = true;
            this.gameOver = true;
            
            // Display checkmate and winner message
            if (currentPlayer === 'white') {
                this.ui.showWinnerMessage('Checkmate! White wins!');
            } else {
                this.ui.showWinnerMessage('Checkmate! Black wins!');
            }
        } else if (inCheck) {
            // RULE 2: Display "Check" message - Player must resolve
            this.isCheck = true;
            this.ui.showCheckMessage(nextPlayer);
        } else if (!hasLegalMoves) {
            // Stalemate - Draw
            this.gameOver = true;
            this.ui.showGameOverMessage('draw', false);
        } else {
            // Normal game continues
            this.isCheck = false;
            this.ui.clearStatusMessage();
        }
    }

    undoMove() {
        if (this.moveHistory.length === 0 || this.thinking) return;

        // Undo move
        this.moveHistory.pop();
        
        // Restore board from saved state
        if (this.moveHistory.length > 0) {
            const lastMove = this.moveHistory[this.moveHistory.length - 1];
            this.board = lastMove.boardState.clone();
        } else {
            this.board.reset();
        }

        // Update turn
        this.isWhiteTurn = this.moveHistory.length % 2 === 0;
        
        // Reset game state
        this.gameOver = false;
        this.isCheck = false;
        this.isCheckmate = false;
        
        this.ui.clearSelection();
        this.ui.clearStatusMessage();
        this.updateDisplay();
    }

    updateDisplay() {
        this.ui.renderBoard(this.board, (row, col) => this.handleSquareClick(row, col));
        this.ui.updateTurnDisplay(this.isWhiteTurn);
        
        const legalMovesCount = PieceMovement.getAllLegalMoves(this.board, this.isWhiteTurn).length;
        this.ui.updateGameInfo(this.moveHistory.length, legalMovesCount, this.isCheck);
        this.ui.updateMoveHistory(this.moveHistory);
        this.ui.disableUndo(this.moveHistory.length === 0 || this.thinking);
    }

    toggleSettings() {
        this.showSettings = !this.showSettings;
        this.ui.toggleSettingsPanel(this.showSettings);
        if (this.showSettings) {
            this.showAbout = false;
            this.ui.toggleAboutPanel(false);
        }
    }

    toggleAbout() {
        this.showAbout = !this.showAbout;
        this.ui.toggleAboutPanel(this.showAbout);
        if (this.showAbout) {
            this.showSettings = false;
            this.ui.toggleSettingsPanel(false);
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MiniChessGame();
});