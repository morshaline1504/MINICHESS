// pieces.js - Piece movement logic

class PieceMovement {
    static getPieceSymbol(piece) {
        const symbols = {
            'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
            'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙'
        };
        return symbols[piece] || '';
    }

    static getLegalMoves(board, row, col, ignoreCheck = false) {
        const piece = board.getPiece(row, col);
        if (!piece) return [];

        const isWhite = board.isWhitePiece(piece);
        const pieceType = piece.toLowerCase();
        let moves = [];

        switch (pieceType) {
            case 'p':
                moves = this.getPawnMoves(board, row, col, isWhite);
                break;
            case 'n':
                moves = this.getKnightMoves(board, row, col, isWhite);
                break;
            case 'b':
                moves = this.getBishopMoves(board, row, col, isWhite);
                break;
            case 'r':
                moves = this.getRookMoves(board, row, col, isWhite);
                break;
            case 'q':
                moves = this.getQueenMoves(board, row, col, isWhite);
                break;
            case 'k':
                moves = this.getKingMoves(board, row, col, isWhite);
                break;
        }

        if (ignoreCheck) {
            return moves;
        }

        // Filter out moves that would leave king in check
        return moves.filter(move => {
            const testBoard = board.clone();
            testBoard.makeMove(row, col, move.row, move.col);
            return !this.isInCheck(testBoard, isWhite);
        });
    }

    static getPawnMoves(board, row, col, isWhite) {
        const moves = [];
        const direction = isWhite ? -1 : 1;
        const startRow = isWhite ? 4 : 1;

        // Forward move
        const nextRow = row + direction;
        if (board.isValidPosition(nextRow, col) && !board.getPiece(nextRow, col)) {
            moves.push({ row: nextRow, col });

            // Double move from start
            const doubleRow = row + 2 * direction;
            if (row === startRow && !board.getPiece(doubleRow, col)) {
                moves.push({ row: doubleRow, col });
            }
        }

        // Captures
        for (const dc of [-1, 1]) {
            const newRow = row + direction;
            const newCol = col + dc;
            if (board.isValidPosition(newRow, newCol)) {
                const target = board.getPiece(newRow, newCol);
                if (target && board.isWhitePiece(target) !== isWhite) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }

        return moves;
    }

    static getKnightMoves(board, row, col, isWhite) {
        const moves = [];
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        for (const [dr, dc] of knightMoves) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (board.isValidPosition(newRow, newCol)) {
                const target = board.getPiece(newRow, newCol);
                if (!target || board.isWhitePiece(target) !== isWhite) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }

        return moves;
    }

    static getBishopMoves(board, row, col, isWhite) {
        return this.getSlidingMoves(board, row, col, isWhite, [
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ]);
    }

    static getRookMoves(board, row, col, isWhite) {
        return this.getSlidingMoves(board, row, col, isWhite, [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ]);
    }

    static getQueenMoves(board, row, col, isWhite) {
        return this.getSlidingMoves(board, row, col, isWhite, [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ]);
    }

    static getKingMoves(board, row, col, isWhite) {
        const moves = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (board.isValidPosition(newRow, newCol)) {
                const target = board.getPiece(newRow, newCol);
                if (!target || board.isWhitePiece(target) !== isWhite) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }

        return moves;
    }

    static getSlidingMoves(board, row, col, isWhite, directions) {
        const moves = [];

        for (const [dr, dc] of directions) {
            let newRow = row + dr;
            let newCol = col + dc;

            while (board.isValidPosition(newRow, newCol)) {
                const target = board.getPiece(newRow, newCol);
                if (!target) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (board.isWhitePiece(target) !== isWhite) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
                newRow += dr;
                newCol += dc;
            }
        }

        return moves;
    }

    static isSquareUnderAttack(board, row, col, byWhite) {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const piece = board.getPiece(r, c);
                if (!piece) continue;
                
                const pieceIsWhite = board.isWhitePiece(piece);
                if (pieceIsWhite === byWhite) {
                    const attacks = this.getLegalMoves(board, r, c, true);
                    if (attacks.some(move => move.row === row && move.col === col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    static isInCheck(board, isWhite) {
        const kingPos = board.findKing(isWhite);
        if (!kingPos) return false;
        return this.isSquareUnderAttack(board, kingPos.row, kingPos.col, !isWhite);
    }

    static getAllLegalMoves(board, isWhiteTurn) {
        const moves = [];
        
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const piece = board.getPiece(row, col);
                if (piece && board.isCurrentPlayerPiece(piece, isWhiteTurn)) {
                    const pieceMoves = this.getLegalMoves(board, row, col);
                    pieceMoves.forEach(move => {
                        moves.push({
                            from: { row, col },
                            to: { row: move.row, col: move.col }
                        });
                    });
                }
            }
        }
        
        return moves;
    }
    
}
