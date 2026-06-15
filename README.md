# 🧩 SudokuForge – Simplified Edition

> Forge your logic. Solve the grid.

<p align="center"> 
  <img src="assets/screenshots/solve_page.JPG" alt="SudokuForge Solve" width="600" style="border-radius: 16px;"> 
</p>

<p align="center"> 
  <a href="#"><img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"></a> 
  <a href="#"><img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"></a> 
  <a href="#"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"></a> 
  <a href="#"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License"></a> 
  <a href="#"><img src="https://img.shields.io/badge/Status-Production_Ready-brightgreen?style=for-the-badge" alt="Status"></a> 
</p>

## 📌 Overview

**SudokuForge – Simplified Edition** is a clean, two‑page Sudoku web app built with vanilla HTML, CSS, and JavaScript. It focuses on the core experience:

- **Solve page** – Play Sudoku with 5 difficulty levels, get hints, check your solution, and send puzzles to the AI solver.
- **AI Solver page** – Uses a backtracking algorithm to solve any valid 9×9 puzzle instantly.

All unnecessary extras have been removed, making it lightweight, fast, and easy to understand.

## ✨ Features

| Category | Highlights |
| :--- | :--- |
| **🎮 Solve Page** | 5 difficulty levels (Easy, Moderate, Hard, Gentle, Diabolical) – puzzle generator with unique solutions |
| **🤖 AI Solver** | Backtracking algorithm – solves any valid puzzle with one click |
| **💡 Hint Engine** | Logical hints (naked single) + solution‑based fallback – works even on Diabolical puzzles |
| **⌨️ Keyboard Shortcuts** | `1-9` enter number, `Delete` clear, `N` new game, `S` solve, `H` hint, `C` check, arrow keys navigation |
| **🔄 Auto Transfer** | Click "🤖 AI Solver" on the Solve page – puzzle is automatically loaded into the Solver page |
| **🎨 UI/UX** | Responsive design, clean card layout, consistent colour theme (blue primary / amber accent) |
| **📦 Zero Dependencies** | Pure HTML/CSS/JS – no frameworks, no build step |

## 🖼️ Screenshots

| Solve Page | AI Solver Page |
| :---: | :---: |
| !Solve Page | *(Add your screenshot here: ai_solver_page.png)* |

## 🛠️ Tech Stack

- **HTML5** – Semantic structure
- **CSS3** – Custom properties, Flexbox/Grid, responsive breakpoints
- **JavaScript (ES6)** – Puzzle generation, backtracking solver, event handling, DOM manipulation
- **LocalStorage** – Cross‑page puzzle transfer

## 📦 Installation

1. **Download or clone** the project folder.
2. **Open `index.html`** in your browser (double‑click or use a local server).
   ```bash
   npx serve .
   ```
No dependencies, no build – just works.

## 🎮 Usage

*   **Play Sudoku** – Open `index.html`, choose a difficulty, click **New Game**, fill the grid.
*   **Get a Hint** – Click **💡 Hint** – the engine fills one cell (logical or solution‑based if needed).
*   **Check Solution** – Click **✅ Check** to see if you solved it correctly.
*   **Use AI Solver** – Click **🤖 AI Solver** – current puzzle is sent automatically to `solver.html`. Then click **Solve Puzzle** to see the solution.
*   **Keyboard Shortcuts** – Focus any cell and use keys: `1-9`, `Delete`, `Arrow keys`, `N`, `H`, `S`, `C`.

## 📁 Project Structure

```text
sudokuforge-simple/
├── index.html          # Solve page
├── solver.html         # AI Solver page
├── css/
│   ├── main.css        # All styles (variables, grid, buttons, etc.)
│   └── responsive.css  # Mobile/tablet breakpoints
├── js/
│   ├── common.js       # Shared: grid render, solver core, navigation
│   ├── solve.js        # Solve page logic (generator, hints, check, transfer)
│   ├── solver.js       # AI Solver page logic (auto-load, solve, clear)
│   └── hint.js         # Advanced hint engine (fixes Diabolical & completion)
└── assets/             # Screenshots and images
```

## 🤝 Contributing

Contributions are welcome! If you find a bug or want to improve the hint engine (e.g., add hidden pairs, X‑Wing), feel free to open an issue or pull request.

## 🔮 Roadmap (possible additions)

- Dark / light theme toggle
- Export/import puzzle as string
- PWA support for offline play
- Timer and move counter

## 📄 License

MIT License – see the LICENSE file for details.

## 🙏 Acknowledgments

Inspired by the original SudokuForge project by Rajdeep (rajdeep292008-pixel). This simplified version refines the core solving experience while keeping the same visual identity.

## 👤 Author

**Affan Adil** – Lead Developer
*   GitHub: @affan675

Built with passion for logic and clean code.

<p align="center"> Made with ❤️ — forge your logic, solve the grid. </p>