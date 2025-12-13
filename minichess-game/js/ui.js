// ui.js - User Interface management with Game Rules Messages

class GameUI {
    constructor() {
        this.boardElement = document.getElementById('chessBoard');
        this.selectedSquare = null;
        this.legalMoves = [];
    }

    renderBoard(board, onSquareClick) {
        this.boardElement.innerHTML = '';

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const square = document.createElement('div');
                square.className = 'square';
                square.dataset.row = row;
                square.dataset.col = col;

                // Alternating colors
                if ((row + col) % 2 === 0) {
                    square.classList.add('light');
                } else {
                    square.classList.add('dark');
                }

                // Add piece
                const piece = board.getPiece(row, col);
                if (piece) {
                    const pieceSpan = document.createElement('span');
                    pieceSpan.className = 'piece';
                    pieceSpan.classList.add(board.isWhitePiece(piece) ? 'white' : 'black');
                    pieceSpan.textContent = PieceMovement.getPieceSymbol(piece);
                    square.appendChild(pieceSpan);
                }

                // Highlight selected square
                if (this.selectedSquare && 
                    this.selectedSquare.row === row && 
                    this.selectedSquare.col === col) {
                    square.classList.add('selected');
                }

                // Highlight legal moves
                const isLegalMove = this.legalMoves.some(
                    move => move.row === row && move.col === col
                );
                if (isLegalMove) {
                    square.classList.add('legal-move');
                    if (!piece) {
                        const indicator = document.createElement('div');
                        indicator.className = 'move-indicator';
                        square.appendChild(indicator);
                    }
                }

                square.addEventListener('click', () => onSquareClick(row, col));
                this.boardElement.appendChild(square);
            }
        }
    }

    setSelectedSquare(row, col) {
        this.selectedSquare = { row, col };
    }

    clearSelection() {
        this.selectedSquare = null;
        this.legalMoves = [];
    }

    setLegalMoves(moves) {
        this.legalMoves = moves;
    }

    updateTurnDisplay(isWhiteTurn) {
        const turnDot = document.getElementById('turnDot');
        const turnText = document.getElementById('turnText');
        
        if (isWhiteTurn) {
            turnDot.classList.remove('black');
            turnText.textContent = 'Current Turn: WHITE';
        } else {
            turnDot.classList.add('black');
            turnText.textContent = 'Current Turn: BLACK';
        }
    }

    updateStatusMessage(message, type = '') {
        const statusElement = document.getElementById('statusMessage');
        statusElement.textContent = message;
        statusElement.className = 'status-text ' + type;
    }

    updateGameInfo(moveCount, legalMovesCount, isCheck) {
        document.getElementById('moveCount').textContent = moveCount;
        document.getElementById('legalMovesCount').textContent = legalMovesCount;
        
        const statusElement = document.getElementById('gameStatus');
        if (isCheck) {
            statusElement.textContent = 'IN CHECK';
            statusElement.className = 'info-value status-check';
        } else {
            statusElement.textContent = 'Normal';
            statusElement.className = 'info-value status-normal';
        }
    }

    updateMoveHistory(history) {
        const historyList = document.getElementById('moveHistoryList');
        
        if (history.length === 0) {
            historyList.innerHTML = '<p class="no-moves">No moves yet</p>';
            return;
        }

        historyList.innerHTML = history.map((move, index) => `
            <div class="move-entry">
                <span class="move-number">${index + 1}.</span>
                <span>${PieceMovement.getPieceSymbol(move.piece)}</span>
                <span>${move.notation}</span>
                ${move.captured ? `<span class="capture">×${PieceMovement.getPieceSymbol(move.captured)}</span>` : ''}
            </div>
        `).join('');

        historyList.scrollTop = historyList.scrollHeight;
    }

    showThinking(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = show ? 'flex' : 'none';
    }

    showGameOverMessage(winner, isCheckmate) {
        let message = '';
        if (winner === 'draw') {
            message = 'STALEMATE - GAME DRAWN!';
        } else {
            message = (isCheckmate ? 'CHECKMATE! ' : '') + 
                      winner.toUpperCase() + ' WINS!';
        }
        this.updateStatusMessage(message, 'checkmate');
    }

    // NEW: Display Check message with player name
    showCheckMessage(player) {
        const playerText = player.toUpperCase();
        this.updateStatusMessage(`⚠ CHECK! ${playerText} King is under attack!`, 'check');
    }

    // NEW: Display Winner message clearly
    showWinnerMessage(message) {
        this.updateStatusMessage(message, 'checkmate');
    }

    clearStatusMessage() {
        this.updateStatusMessage('', '');
    }

    toggleSettingsPanel(show) {
        const panel = document.getElementById('settingsPanel');
        panel.style.display = show ? 'block' : 'none';
    }

    toggleAboutPanel(show) {
        const panel = document.getElementById('aboutPanel');
        panel.style.display = show ? 'block' : 'none';
    }

    updateSettingsVisibility(gameMode) {
        const playerColorGroup = document.getElementById('playerColorGroup');
        const aiDifficultyGroup = document.getElementById('aiDifficultyGroup');
        
        if (gameMode === 'human-human') {
            playerColorGroup.style.display = 'none';
            aiDifficultyGroup.style.display = 'none';
        } else if (gameMode === 'human-ai') {
            playerColorGroup.style.display = 'block';
            aiDifficultyGroup.style.display = 'block';
        } else { // ai-ai
            playerColorGroup.style.display = 'none';
            aiDifficultyGroup.style.display = 'block';
        }
    }

    disableUndo(disabled) {
        document.getElementById('undoBtn').disabled = disabled;
    }

    getMoveNotation(fromRow, fromCol, toRow, toCol) {
        const fromNotation = String.fromCharCode(97 + fromCol) + (ROWS - fromRow);
        const toNotation = String.fromCharCode(97 + toCol) + (ROWS - toRow);
        return `${fromNotation} → ${toNotation}`;
    }
}