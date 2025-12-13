# MINICHESS AI

A fully functional implementation of MiniChess with advanced AI opponent powered by Minimax algorithm with Alpha-Beta pruning optimization.

## Project Structure

```
minichess-ai/
├── index.html              
├── css/
│   └── styles.css         
├── js/
│   ├── board.js           
│   ├── pieces.js          
│   ├── evaluation.js      
│   ├── minimax.js         
│   ├── ai.js              
│   ├── ui.js              
│   └── game.js            
└── README.md              
```

## How to Run in VS Code

### Method 1: Live Server Extension

1. **Install Live Server Extension:**
   - Open VS Code
   - Click Extensions icon in left sidebar (Ctrl+Shift+X)
   - Search for "Live Server"
   - Install "Live Server" by Ritwick Dey

2. **Open Project:**
   ```bash
   cd minichess-ai
   code .
   ```

3. **Run:**
   - Open `index.html` file in VS Code
   - Right-click inside the file
   - Select "Open with Live Server"
   - Or click "Go Live" button in Status Bar
   - Browser will open automatically at http://127.0.0.1:5500

### Method 2: Python HTTP Server

```bash
cd minichess-ai

python -m http.server 8000

# Or if using Python 2
python -m SimpleHTTPServer 8000
```

Then open browser at: `http://localhost:8000`

### Method 3: Node.js HTTP Server

```bash
npm install -g http-server

cd minichess-ai

http-server

# Or specify port
http-server -p 8080
```

Open browser at: `http://localhost:8080`

### Method 4: Direct Browser Open

- Double-click `index.html` file
- Or drag and drop into browser
- Works for basic functionality

## File Structure

### JavaScript Files:

1. **board.js** - Board state and move management
   - Location: `js/board.js`
   - Purpose: Board creation, piece placement, move execution

2. **pieces.js** - Piece movement rules
   - Location: `js/pieces.js`
   - Purpose: Movement logic for all pieces, legal move calculation

3. **evaluation.js** - Board evaluation
   - Location: `js/evaluation.js`
   - Purpose: Calculate position scores

4. **minimax.js** - Minimax algorithm
   - Location: `js/minimax.js`
   - Purpose: AI decision making with Alpha-Beta pruning

5. **ai.js** - AI player controller
   - Location: `js/ai.js`
   - Purpose: AI move calculation and timing

6. **ui.js** - User interface
   - Location: `js/ui.js`
   - Purpose: Board rendering, status updates, visual feedback

7. **game.js** - Main controller
   - Location: `js/game.js`
   - Purpose: Coordinates all components

## How to Play

1. **Select Game Mode:**
   - Human vs Human: Two players locally
   - Human vs AI: Play against the AI
   - AI vs AI: Watch two AIs compete

2. **Configure Settings:**
   - Choose your color (White/Black)
   - Select AI Difficulty (Depth 1-4)

3. **Start Playing:**
   - Click a piece to select it
   - Legal moves shown in green
   - Click destination square to move

4. **Controls:**
   - **New Game:** Start a fresh game
   - **Undo:** Reverse last move
   - **Reset Game Mode:** Return to default settings

## Game Rules

### Board Setup (6×5)
```
Row 0: [r] [n] [q] [k] [b]  ← Black pieces
Row 1: [p] [p] [p] [p] [p]  ← Black pawns
Row 2: [ ] [ ] [ ] [ ] [ ]
Row 3: [ ] [ ] [ ] [ ] [ ]
Row 4: [P] [P] [P] [P] [P]  ← White pawns
Row 5: [R] [N] [Q] [K] [B]  ← White pieces
```

### Special Rules:
- **Pawn Promotion:** Pawns reaching the last row become Queens
- **Check:** King is under attack
- **Checkmate:** No legal moves to escape check
- **Stalemate:** No legal moves but not in check (draw)

## AI Features

### Minimax Algorithm:
- Searches game tree to find best move
- Uses Maximizer (Black) and Minimizer (White) approach
- Assumes optimal play from opponent

### Alpha-Beta Pruning:
- Significantly reduces search space
- Same results, faster execution
- Enables deeper searches

### Difficulty Levels:
- **Beginner (Depth 1):** Looks 1 move ahead
- **Balanced (Depth 2):** Looks 2 moves ahead (Default)
- **Advanced (Depth 3):** Looks 3 moves ahead
- **Expert (Depth 4):** Looks 4 moves ahead

## Technical Details

**Technologies:**
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Object-Oriented Programming

**Features:**
- Responsive design
- Move history tracking
- Check/Checkmate detection
- Undo functionality
- Multiple game modes
- Visual feedback

## Evaluation Function

**Material Values:**
- Pawn: 100
- Knight: 320
- Bishop: 330
- Rook: 500
- Queen: 900
- King: 20,000

**Positional Factors:**
- Piece-square tables
- Center control bonus
- King safety
- Check penalties/bonuses

## Troubleshooting

### Game not starting?
- Check console for errors (F12)
- Verify all JS files are loaded correctly
- Clear browser cache (Ctrl+Shift+Delete)

### AI not moving?
- Check console for errors
- Look for "AI Thinking..." message
- Refresh page and try again

### Board not displaying?
- Verify styles.css is loaded correctly
- Check browser console for CSS errors



## Development

### Code Structure:
- **Modular Design:** Each file handles specific responsibility
- **OOP Principles:** Uses classes and encapsulation
- **Clean Code:** Meaningful variable names

### Future Enhancements:
- Move animation
- Sound effects
- Save/Load games
- Online multiplayer
- Opening book
- Endgame tablebases

**Enjoy playing MiniChess AI! ♟️**
