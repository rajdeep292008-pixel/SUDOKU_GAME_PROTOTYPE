// Solve page: puzzle generator, hint, check, difficulty

(function() {
  // Helper: shuffle
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function fillBox(grid, rowStart, colStart) {
    const nums = [1,2,3,4,5,6,7,8,9];
    shuffle(nums);
    let idx = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        grid[rowStart + i][colStart + j] = nums[idx++];
      }
    }
  }

  function generateFullSolution() {
    const grid = Array(9).fill().map(() => Array(9).fill(0));
    for (let box = 0; box < 9; box += 3) fillBox(grid, box, box);
    solveSudokuBacktrack(grid);
    return grid;
  }

  function countSolutions(grid, limit = 2) {
    const copy = grid.map(r => [...r]);
    let count = 0;
    function bt() {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (copy[r][c] === 0) {
            for (let n = 1; n <= 9; n++) {
              if (isValidPlacement(copy, r, c, n)) {
                copy[r][c] = n;
                bt();
                copy[r][c] = 0;
                if (count >= limit) return;
              }
            }
            return;
          }
        }
      }
      count++;
    }
    bt();
    return count;
  }

  const difficultyClues = {
    easy: 38, moderate: 32, hard: 26, gentle: 42, diabolical: 22
  };

  function generatePuzzle(diffKey) {
    const target = difficultyClues[diffKey] || 32;
    const solution = generateFullSolution();
    const puzzle = solution.map(r => [...r]);
    const indices = Array.from({ length: 81 }, (_, i) => i);
    shuffle(indices);
    let removed = 0;
    for (const idx of indices) {
      if (81 - removed <= target) break;
      const r = Math.floor(idx / 9), c = idx % 9;
      const backup = puzzle[r][c];
      puzzle[r][c] = 0;
      if (countSolutions(puzzle.map(rr => [...rr]), 2) !== 1) {
        puzzle[r][c] = backup;
      } else {
        removed++;
      }
    }
    return { puzzle, solution };
  }

  // Hint engine (naked single)
  function findHint(userGrid, solutionGrid) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (userGrid[r][c] !== 0 && userGrid[r][c] !== solutionGrid[r][c]) {
          return { error: true, message: "⚠️ Fix incorrect numbers before hint." };
        }
      }
    }
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (userGrid[r][c] === 0) {
          let candidates = [];
          for (let n = 1; n <= 9; n++) {
            if (isValidPlacement(userGrid, r, c, n)) candidates.push(n);
          }
          if (candidates.length === 1) {
            return { row: r, col: c, value: candidates[0] };
          }
        }
      }
    }
    return { error: true, message: "🧠 No direct hint. Keep solving!" };
  }

  // DOM elements
  let currentSolution = null;
  let currentDifficulty = 'easy';

  const diffBtns = document.querySelectorAll('.diff-btn');
  const newBtn = document.getElementById('newGameBtn');
  const checkBtn = document.getElementById('checkBtn');
  const hintBtn = document.getElementById('hintBtn');
  const aiSolveBtn = document.getElementById('aiSolveBtn');
  const statusDiv = document.getElementById('statusMsg');

  function loadPuzzle() {
    const { puzzle, solution } = generatePuzzle(currentDifficulty);
    currentSolution = solution;
    renderSudokuGrid('solve-grid', puzzle, true);
    statusDiv.innerHTML = `🎲 New ${currentDifficulty.toUpperCase()} puzzle. Good luck!`;
    localStorage.removeItem('sudokuForge_puzzle_simple');
  }

  function checkSolution() {
    if (!currentSolution) return;
    const user = readGridFromTable('solve-grid');
    let ok = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (user[i][j] !== currentSolution[i][j]) ok = false;
      }
    }
    statusDiv.innerHTML = ok ? '🎉 Perfect! Puzzle solved.' : '❌ Not solved yet. Keep trying!';
  }

  // In solve.js, inside the IIFE, replace the existing handleHint function:

function handleHint() {
    if (!currentSolution) {
        statusDiv.innerHTML = '⚠️ No active puzzle. Start new game.';
        return;
    }
    const userGrid = readGridFromTable('solve-grid');
    const hint = getHint(userGrid, currentSolution);   // using new hint.js

    if (hint.error) {
        statusDiv.innerHTML = hint.message;
        // If the puzzle is fully solved, optionally trigger a visual celebration
        if (hint.message.includes("All done")) {
            // You could also add confetti effect or disable hint button
        }
        return;
    }

    const table = document.getElementById('solve-grid');
    const targetCell = table.rows[hint.row].cells[hint.col];
    const input = targetCell.querySelector('input');
    if (input && !targetCell.classList.contains('given')) {
        input.value = hint.value;
        targetCell.classList.add('highlight-hint');
        setTimeout(() => targetCell.classList.remove('highlight-hint'), 900);
        statusDiv.innerHTML = hint.message || `💡 Hint: placed ${hint.value} at (${hint.row+1},${hint.col+1})`;
    } else {
        statusDiv.innerHTML = '⚠️ Cannot hint this cell (it may be a given number).';
    }
}

  function sendToSolver() {
    const currentGrid = readGridFromTable('solve-grid');
    localStorage.setItem('sudokuForge_puzzle_simple', JSON.stringify(currentGrid));
    window.location.href = 'solver.html';
  }

  // event listeners
  diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      diffBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDifficulty = btn.dataset.diff;
      loadPuzzle();
    });
  });
  newBtn.addEventListener('click', loadPuzzle);
  checkBtn.addEventListener('click', checkSolution);
  hintBtn.addEventListener('click', handleHint);
  aiSolveBtn.addEventListener('click', sendToSolver);

  // keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    const key = e.key.toLowerCase();
    if (key === 'n') { newBtn.click(); e.preventDefault(); }
    if (key === 'h') { hintBtn.click(); e.preventDefault(); }
    if (key === 's') { aiSolveBtn.click(); e.preventDefault(); }
    if (key === 'c') { checkBtn.click(); e.preventDefault(); }
  });

  attachGridNavigation('solve-grid');
  loadPuzzle(); // initial
})();