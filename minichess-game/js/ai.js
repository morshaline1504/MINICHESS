// ai.js - AI player controller

class AIPlayer {
    constructor(difficulty = 2) {
        this.difficulty = difficulty;
    }

    setDifficulty(depth) {
        this.difficulty = depth;
    }

    makeMove(board, isWhiteTurn) {
        return new Promise((resolve) => {
            // Simulate thinking time for better UX
            setTimeout(() => {
                const bestMove = MinimaxAI.getBestMove(board, isWhiteTurn, this.difficulty);
                resolve(bestMove);
            }, 300);
        });
    }

    async getMoveForAIvsAI(board, isWhiteTurn) {
        // For AI vs AI, use faster timing
        return new Promise((resolve) => {
            setTimeout(() => {
                const bestMove = MinimaxAI.getBestMove(board, isWhiteTurn, this.difficulty);
                resolve(bestMove);
            }, 100);
        });
    }
}