// evaluation.js - Board evaluation functions

class BoardEvaluation {
    static PIECE_VALUES = {
        'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000,
        'P': -100, 'N': -320, 'B': -330, 'R': -500, 'Q': -900, 'K': -20000
    };

    // Positional tables for 6x5 board
    static PAWN_TABLE = [
        [0, 0, 0, 0, 0],     // Row 0 (Black promotion)
        [50, 50, 50, 50, 50], // Row 1
        [10, 10, 20, 10, 10], // Row 2
        [5, 5, 10, 5, 5],     // Row 3
        [0, 0, 0, 0, 0],      // Row 4
        [0, 0, 0, 0, 0]       // Row 5 (White promotion)
    ];

    static KNIGHT_TABLE = [
        [-50, -40, -30, -40, -50],
        [-40, -20, 0, -20, -40],
        [-30, 5, 10, 5, -30],
        [-30, 5, 10, 5, -30],
        [-40, -20, 0, -20, -40],
        [-50, -40, -30, -40, -50]
    ];

    static KING_TABLE = [
        [-30, -40, -40, -40, -30],
        [-30, -40, -40, -40, -30],
        [-30, -40, -40, -40, -30],
        [-30, -40, -40, -40, -30],
        [-20, -30, -30, -30, -20],
        [20, 20, 0, 0, 20]
    ];

    static evaluateBoard(board) {
        let score = 0;

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const piece = board.getPiece(row, col);
                if (!piece) continue;

                const isWhite = board.isWhitePiece(piece);
                const pieceType = piece.toLowerCase();
                
                // Material value
                score += this.PIECE_VALUES[piece];

                // Positional bonuses
                if (pieceType === 'p') {
                    const tableRow = isWhite ? row : (ROWS - 1 - row);
                    score += isWhite ? 
                        -this.PAWN_TABLE[tableRow][col] : 
                        this.PAWN_TABLE[tableRow][col];
                } else if (pieceType === 'n') {
                    const tableRow = isWhite ? row : (ROWS - 1 - row);
                    score += isWhite ? 
                        -this.KNIGHT_TABLE[tableRow][col] : 
                        this.KNIGHT_TABLE[tableRow][col];
                } else if (pieceType === 'k') {
                    const tableRow = isWhite ? row : (ROWS - 1 - row);
                    score += isWhite ? 
                        -this.KING_TABLE[tableRow][col] : 
                        this.KING_TABLE[tableRow][col];
                }

                // Center control bonus
                const centerCol = Math.floor(COLS / 2);
                if (col === centerCol) {
                    score += isWhite ? -10 : 10;
                }
            }
        }

        // Check penalties/bonuses
        if (PieceMovement.isInCheck(board, true)) {
            score -= 50;
        }
        if (PieceMovement.isInCheck(board, false)) {
            score += 50;
        }

        return score;
    }

    static isGameOver(board) {
        return board.isKingCaptured(true) || board.isKingCaptured(false);
    }

    static getWinner(board) {
        if (board.isKingCaptured(false)) return 'white';
        if (board.isKingCaptured(true)) return 'black';
        return null;
    }
}