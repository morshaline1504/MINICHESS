// board.js - Board state management and move validation

const ROWS = 6;
const COLS = 5;

// Initial board setup for 6x5 MiniChess
const INITIAL_BOARD = [
    ['r', 'n', 'q', 'k', 'b'],
    ['p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null],
    [null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'Q', 'K', 'B']
];

class Board {
    constructor() {
        this.board = this.createInitialBoard();
    }

    createInitialBoard() {
        return INITIAL_BOARD.map(row => [...row]);
    }

    reset() {
        this.board = this.createInitialBoard();
    }

    getPiece(row, col) {
        if (!this.isValidPosition(row, col)) return null;
        return this.board[row][col];
    }

    setPiece(row, col, piece) {
        if (this.isValidPosition(row, col)) {
            this.board[row][col] = piece;
        }
    }

    isValidPosition(row, col) {
        return row >= 0 && row < ROWS && col >= 0 && col < COLS;
    }

    isWhitePiece(piece) {
        return piece && piece === piece.toUpperCase();
    }

    isBlackPiece(piece) {
        return piece && piece === piece.toLowerCase();
    }

    isCurrentPlayerPiece(piece, isWhiteTurn) {
        if (!piece) return false;
        return isWhiteTurn ? this.isWhitePiece(piece) : this.isBlackPiece(piece);
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.getPiece(fromRow, fromCol);
        const captured = this.getPiece(toRow, toCol);
        
        this.setPiece(toRow, toCol, piece);
        this.setPiece(fromRow, fromCol, null);

        // Pawn promotion
        if (piece && piece.toLowerCase() === 'p') {
            if ((piece === 'P' && toRow === 0) || (piece === 'p' && toRow === ROWS - 1)) {
                this.setPiece(toRow, toCol, piece === 'P' ? 'Q' : 'q');
            }
        }

        return captured;
    }

    clone() {
        const newBoard = new Board();
        newBoard.board = this.board.map(row => [...row]);
        return newBoard;
    }

    findKing(isWhite) {
        const kingPiece = isWhite ? 'K' : 'k';
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (this.getPiece(row, col) === kingPiece) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    isKingCaptured(isWhite) {
        return this.findKing(isWhite) === null;
    }
}