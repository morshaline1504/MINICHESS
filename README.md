# MINICHESS
A fully functional implementation of MiniChess with advanced AI opponent powered by Minimax algorithm with Alpha-Beta pruning optimization.

# MiniChess AI - 6×5 Chess Game

একটি সম্পূর্ণ কার্যকরী MiniChess গেম যেখানে Minimax Algorithm এবং Alpha-Beta Pruning ব্যবহার করে AI তৈরি করা হয়েছে।
 
Project Structure

```
minichess-ai/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All styling
├── js/
│   ├── board.js           # Board state management
│   ├── pieces.js          # Piece movement logic
│   ├── evaluation.js      # Position evaluation
│   ├── minimax.js         # Minimax algorithm
│   ├── ai.js              # AI controller
│   ├── ui.js              # User interface
│   └── game.js            # Main game controller
└── README.md              # This file
```

কিভাবে VS Code এ Run করবেন

Method 1: Live Server Extension (সবচেয়ে সহজ)

1.  Live Server Extension Install করুন:**
   - VS Code খুলুন
   - Left sidebar এ Extensions icon (Ctrl+Shift+X) এ ক্লিক করুন
   - Search করুন: "Live Server"
   - "Live Server" by Ritwick Dey - Install করুন

2. Project খুলুন:
   ```bash
   # Terminal এ এই command দিন:
   cd minichess-ai
   code .
   ```

3. Run করুন:
   - `index.html` file টি VS Code এ খুলুন
   - File এর মধ্যে Right-click করুন
   - "Open with Live Server" select করুন
   - অথবা নিচে Status Bar এ "Go Live" button এ ক্লিক করুন
   - Browser এ automatically খুলে যাবে (http://127.0.0.1:5500)

 
Method 2: Python HTTP Server (যদি Python installed থাকে)

```bash
# Project folder এ যান
cd minichess-ai

# Python 3 দিয়ে server run করুন
python -m http.server 8000

# অথবা Python 2 থাকলে
python -m SimpleHTTPServer 8000
```

তারপর browser এ যান: `http://localhost:8000`

Method 3: Node.js HTTP Server

```bash
প্রথমে http-server install করুন (globally)
npm install -g http-server

# Project folder এ যান
cd minichess-ai

# Server run করুন
http-server

# অথবা specific port এ
http-server -p 8080
```

Browser এ যান: `http://localhost:8080`

### Method 4: Direct Browser Open (Simple কিন্তু কিছু limitation আছে)

- `index.html` file এ double-click করুন
- অথবা browser এ drag and drop করুন
- সাধারণত কাজ করবে, কিন্তু কিছু advanced feature এ সমস্যা হতে পারে

## 📝 File গুলোর Code কোথায়?

### JS Files Location:

1. **board.js** - Board state এবং move management
   - Location: `js/board.js`
   - Purpose: Board তৈরি, piece placement, move execution

2. **pieces.js** - Piece movement rules
   - Location: `js/pieces.js`
   - Purpose: সব piece এর movement logic, legal move calculation

3. **evaluation.js** - Board evaluation
   - Location: `js/evaluation.js`
   - Purpose: Board position এর score calculate করা

4. **minimax.js** - Minimax algorithm
   - Location: `js/minimax.js`
   - Purpose: AI এর decision making, Alpha-Beta pruning

5. **ai.js** - AI player controller
   - Location: `js/ai.js`
   - Purpose: AI move calculation এবং timing

6. **ui.js** - User interface
   - Location: `js/ui.js`
   - Purpose: Board render, status update, visual feedback

7. **game.js** - Main controller
   - Location: `js/game.js`
   - Purpose: সব component একসাথে coordinate করা

## 🎮 কিভাবে খেলবেন

1. **Game Mode Select করুন:**
   - Human vs Human: দুজন player locally
   - Human vs AI: AI এর বিরুদ্ধে খেলুন
   - AI vs AI: দুটি AI এর মধ্যে game দেখুন

2. **Settings Configure করুন:**
   - আপনার color choose করুন (White/Black)
   - AI Difficulty select করুন (Depth 1-4)

3. **খেলা শুরু করুন:**
   - Piece এ click করে select করুন
   - Legal moves green color এ দেখাবে
   - Destination square এ click করে move করুন

4. **Controls:**
   - **New Game:** নতুন game শুরু
   - **Undo:** শেষ move reverse করুন
   - **Reset Game Mode:** Default settings এ ফিরে যান

## 🎯 Game Rules

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
- **Pawn Promotion:** Pawn শেষ row এ পৌঁছালে Queen হয়ে যায়
- **Check:** King attack এর মধ্যে থাকলে check
- **Checkmate:** Check থেকে escape করার কোনো move না থাকলে
- **Stalemate:** Legal move না থাকলে কিন্তু check না থাকলে draw

## 🤖 AI Features

### Minimax Algorithm:
- Game tree search করে best move খুঁজে বের করে
- Maximizer (Black) এবং Minimizer (White) approach
- Optimal play assume করে

### Alpha-Beta Pruning:
- Search space significantly reduce করে
- Same result, কিন্তু faster execution
- Deeper search possible করে

### Difficulty Levels:
- **Beginner (Depth 1):** 1 move ahead দেখে
- **Balanced (Depth 2):** 2 moves ahead (Default)
- **Advanced (Depth 3):** 3 moves ahead
- **Expert (Depth 4):** 4 moves ahead

## 🛠️ Technical Details

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

## 📊 Evaluation Function

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

## 🐛 Troubleshooting

### Game শুরু হচ্ছে না?
- Console errors check করুন (F12)
- সব JS files correctly loaded হয়েছে কিনা দেখুন
- Browser cache clear করুন (Ctrl+Shift+Delete)

### AI move হচ্ছে না?
- Console এ error আছে কিনা দেখুন
- "AI Thinking..." message দেখাচ্ছে কিনা check করুন
- Page refresh করে আবার try করুন

### Board দেখাচ্ছে না?
- styles.css correctly loaded হয়েছে কিনা check করুন
- Browser console এ CSS errors আছে কিনা দেখুন

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📖 Additional Resources

- Project Report: বিস্তারিত documentation
- Code Comments: প্রতিটি function এ explanation আছে
- Algorithm Explanation: Report এ full details

## 👨‍💻 Development

### Code Structure:
- **Modular Design:** প্রতিটি file একটি specific responsibility handle করে
- **OOP Principles:** Classes এবং encapsulation ব্যবহার করা হয়েছে
- **Clean Code:** Meaningful variable names এবং comments

### Future Enhancements:
- Move animation
- Sound effects
- Save/Load games
- Online multiplayer
- Opening book
- Endgame tablebases

## 📄 License

এই project educational purposes এর জন্য তৈরি।

## 🤝 Contributing

Suggestions এবং improvements welcome!

---

**Enjoy playing MiniChess AI! ♟️**

যদি কোনো সমস্যা হয় বা প্রশ্ন থাকে, feel free to ask!
