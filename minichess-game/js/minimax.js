// minimax.js - Minimax algorithm with alpha-beta pruning and EARLY STOPPING

class MinimaxAI {
    // Early stopping parameters
    static MAX_TIME_MS = 5000; // Maximum thinking time: 5 seconds
    static searchStartTime = 0;
    static nodesSearched = 0;
    
    static shouldStopSearch() {
        // Check if time limit exceeded
        const elapsed = Date.now() - this.searchStartTime;
        return elapsed > this.MAX_TIME_MS;
    }

    static minimax(board, depth, alpha, beta, maximizingPlayer, moveCount) {
        // EARLY STOPPING: Check time limit
        if (this.shouldStopSearch()) {
            return BoardEvaluation.evaluateBoard(board);
        }

        this.nodesSearched++;

        // Base case: depth limit or game over
        if (depth === 0 || BoardEvaluation.isGameOver(board) || moveCount > 100) {
            return BoardEvaluation.evaluateBoard(board);
        }

        const isWhiteTurn = !maximizingPlayer;
        const moves = PieceMovement.getAllLegalMoves(board, isWhiteTurn);

        // No legal moves (checkmate or stalemate)
        if (moves.length === 0) {
            if (PieceMovement.isInCheck(board, isWhiteTurn)) {
                // Checkmate - heavily penalize/reward
                return maximizingPlayer ? -100000 + moveCount : 100000 - moveCount;
            }
            // Stalemate
            return 0;
        }

        if (maximizingPlayer) {
            let maxEval = -Infinity;
            
            for (const move of moves) {
                // EARLY STOPPING: Check before evaluating each move
                if (this.shouldStopSearch()) {
                    break;
                }

                const testBoard = board.clone();
                testBoard.makeMove(move.from.row, move.from.col, move.to.row, move.to.col);
                
                const evaluation = this.minimax(testBoard, depth - 1, alpha, beta, false, moveCount + 1);
                maxEval = Math.max(maxEval, evaluation);
                alpha = Math.max(alpha, evaluation);
                
                if (beta <= alpha) {
                    break; // Beta cutoff (alpha-beta pruning)
                }
            }
            
            return maxEval;
        } else {
            let minEval = Infinity;
            
            for (const move of moves) {
                // EARLY STOPPING: Check before evaluating each move
                if (this.shouldStopSearch()) {
                    break;
                }

                const testBoard = board.clone();
                testBoard.makeMove(move.from.row, move.from.col, move.to.row, move.to.col);
                
                const evaluation = this.minimax(testBoard, depth - 1, alpha, beta, true, moveCount + 1);
                minEval = Math.min(minEval, evaluation);
                beta = Math.min(beta, evaluation);
                
                if (beta <= alpha) {
                    break; // Alpha cutoff (alpha-beta pruning)
                }
            }
            
            return minEval;
        }
    }

    static getBestMove(board, isWhiteTurn, depth) {
        // Initialize early stopping timer
        this.searchStartTime = Date.now();
        this.nodesSearched = 0;

        const moves = PieceMovement.getAllLegalMoves(board, isWhiteTurn);
        
        if (moves.length === 0) {
            return null;
        }

        let bestMove = moves[0];
        let bestValue = isWhiteTurn ? Infinity : -Infinity;

        // Iterative deepening with early stopping
        let currentDepth = 1;
        while (currentDepth <= depth && !this.shouldStopSearch()) {
            let depthBestMove = null;
            let depthBestValue = isWhiteTurn ? Infinity : -Infinity;

            for (const move of moves) {
                // Check early stopping before each move
                if (this.shouldStopSearch()) {
                    console.log(`Early stopping at depth ${currentDepth}, nodes: ${this.nodesSearched}`);
                    break;
                }

                const testBoard = board.clone();
                testBoard.makeMove(move.from.row, move.from.col, move.to.row, move.to.col);
                
                const value = this.minimax(
                    testBoard, 
                    currentDepth - 1, 
                    -Infinity, 
                    Infinity, 
                    !isWhiteTurn,
                    0
                );
                
                if (isWhiteTurn && value < depthBestValue) {
                    depthBestValue = value;
                    depthBestMove = move;
                } else if (!isWhiteTurn && value > depthBestValue) {
                    depthBestValue = value;
                    depthBestMove = move;
                }
            }

            // Update best move if we completed this depth
            if (depthBestMove && !this.shouldStopSearch()) {
                bestMove = depthBestMove;
                bestValue = depthBestValue;
            }

            currentDepth++;
        }

        const totalTime = Date.now() - this.searchStartTime;
        console.log(`Search completed: ${this.nodesSearched} nodes, ${totalTime}ms, final depth: ${currentDepth - 1}`);

        return bestMove;
    }

    // Optional: Set custom time limit
    static setTimeLimit(milliseconds) {
        this.MAX_TIME_MS = milliseconds;
    }
}