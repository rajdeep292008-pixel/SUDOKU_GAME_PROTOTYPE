// AI Solver page: auto-load puzzle from localStorage (if present)
(function() {
  const gridTableId = 'solver-grid';
  const solveBtn = document.getElementById('solveAIBtn');
  const clearBtn = document.getElementById('clearSolverBtn');
  const statusDiv = document.getElementById('solverStatus');

  function createEmptyGrid() {
    const empty = Array(9).fill().map(() => Array(9).fill(0));
    renderSudokuGrid(gridTableId, empty, false);
  }

  // Auto-load from localStorage when page loads
  function autoLoadFromSolve() {
    const stored = localStorage.getItem('sudokuForge_puzzle_simple');
    if (stored) {
      try {
        const puzzle = JSON.parse(stored);
        if (puzzle && puzzle.length === 9) {
          renderSudokuGrid(gridTableId, puzzle, false);
          statusDiv.innerHTML = '📋 Puzzle loaded from Solve page. Click "Solve" to see the solution.';
          localStorage.removeItem('sudokuForge_puzzle_simple'); // clear after load
          return true;
        }
      } catch(e) { /* ignore */ }
    }
    createEmptyGrid();
    statusDiv.innerHTML = '✨ No puzzle from Solve page. Enter numbers manually and click "Solve".';
    return false;
  }

  function solveCurrent() {
    const grid = readGridFromTable(gridTableId);
    let hasNonZero = false;
    for (let r = 0; r < 9 && !hasNonZero; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] !== 0) { hasNonZero = true; break; }
      }
    }
    if (!hasNonZero) {
      statusDiv.innerHTML = '⚠️ Empty grid. Enter some numbers or go back to Solve page.';
      return;
    }
    const boardCopy = grid.map(row => [...row]);
    const solved = solveSudokuBacktrack(boardCopy);
    if (solved) {
      renderSudokuGrid(gridTableId, boardCopy, false);
      statusDiv.innerHTML = '✅ Puzzle solved!';
    } else {
      statusDiv.innerHTML = '❌ Unsolvable puzzle. Check for conflicts.';
    }
  }

  function clearGrid() {
    const empty = Array(9).fill().map(() => Array(9).fill(0));
    renderSudokuGrid(gridTableId, empty, false);
    statusDiv.innerHTML = '🧹 Grid cleared. You can start fresh.';
    localStorage.removeItem('sudokuForge_puzzle_simple');
  }

  solveBtn.addEventListener('click', solveCurrent);
  clearBtn.addEventListener('click', clearGrid);

  // keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    const key = e.key.toLowerCase();
    if (key === 's') { solveBtn.click(); e.preventDefault(); }
    if (key === 'c') { clearBtn.click(); e.preventDefault(); }
  });

  attachGridNavigation(gridTableId);
  
  // Auto-load puzzle from Solve page
  autoLoadFromSolve();
})();