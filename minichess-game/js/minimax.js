

class MinimaxAI {
   
    static MAX_TIME_MS = 5000; 
    static searchStartTime = 0;
    static nodesSearched = 0;
    
    static shouldStopSearch() {
      
        const elapsed = Date.now() - this.searchStartTime;
        return elapsed > this.MAX_TIME_MS;
    }

    static minimax(board, depth, alpha, beta, maximizingPlayer, moveCount) {
        
        if (this.shouldStopSearch()) {
            return BoardEvaluation.evaluateBoard(board);
        }

        this.nodesSearched++;

     
        if (depth === 0 || BoardEvaluation.isGameOver(board) || moveCount > 100) {
            return BoardEvaluation.evaluateBoard(board);
        }

        const isWhiteTurn = !maximizingPlayer;
        const moves = PieceMovement.getAllLegalMoves(board, isWhiteTurn);

        
        if (moves.length === 0) {
            if (PieceMovement.isInCheck(board, isWhiteTurn)) {
               
                return maximizingPlayer ? -100000 + moveCount : 100000 - moveCount;
            }
           
            return 0;
        }

        if (maximizingPlayer) {
            let maxEval = -Infinity;
            
            for (const move of moves) {
              
                if (this.shouldStopSearch()) {
                    break;
                }

                const testBoard = board.clone();
                testBoard.makeMove(move.from.row, move.from.col, move.to.row, move.to.col);
                
                const evaluation = this.minimax(testBoard, depth - 1, alpha, beta, false, moveCount + 1);
                maxEval = Math.max(maxEval, evaluation);
                alpha = Math.max(alpha, evaluation);
                
                if (beta <= alpha) {
                    break; 
                }
            }
            
            return maxEval;
        } else {
            let minEval = Infinity;
            
            for (const move of moves) {
               
                if (this.shouldStopSearch()) {
                    break;
                }

                const testBoard = board.clone();
                testBoard.makeMove(move.from.row, move.from.col, move.to.row, move.to.col);
                
                const evaluation = this.minimax(testBoard, depth - 1, alpha, beta, true, moveCount + 1);
                minEval = Math.min(minEval, evaluation);
                beta = Math.min(beta, evaluation);
                
                if (beta <= alpha) {
                    break;
                }
            }
            
            return minEval;
        }
    }

    static getBestMove(board, isWhiteTurn, depth) {
        
        this.searchStartTime = Date.now();
        this.nodesSearched = 0;

        const moves = PieceMovement.getAllLegalMoves(board, isWhiteTurn);
        
        if (moves.length === 0) {
            return null;
        }

        let bestMove = moves[0];
        let bestValue = isWhiteTurn ? Infinity : -Infinity;

       
        let currentDepth = 1;
        while (currentDepth <= depth && !this.shouldStopSearch()) {
            let depthBestMove = null;
            let depthBestValue = isWhiteTurn ? Infinity : -Infinity;

            for (const move of moves) {
             
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

    
    static setTimeLimit(milliseconds) {
        this.MAX_TIME_MS = milliseconds;
    }
}
