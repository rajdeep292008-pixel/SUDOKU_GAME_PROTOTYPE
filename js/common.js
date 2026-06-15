// Shared utilities and grid renderer for both solve and solver pages

function renderSudokuGrid(tableId, grid, isEditable = true) {
  const table = document.getElementById(tableId);
  if (!table) return;
  table.innerHTML = '';
  for (let r = 0; r < 9; r++) {
    const tr = document.createElement('tr');
    for (let c = 0; c < 9; c++) {
      const td = document.createElement('td');
      const val = grid[r][c];
      if (!isEditable) {
        // solver page: always inputs (user can edit)
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.inputMode = 'numeric';
        if (val !== 0) input.value = val;
        input.addEventListener('input', function(e) {
          this.value = this.value.replace(/[^1-9]/g, '');
        });
        td.appendChild(input);
      } else {
        // solve page: given numbers are static
        if (val !== 0) {
          td.textContent = val;
          td.classList.add('given');
        } else {
          const input = document.createElement('input');
          input.type = 'text';
          input.maxLength = 1;
          input.inputMode = 'numeric';
          input.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^1-9]/g, '');
          });
          td.appendChild(input);
        }
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}

function readGridFromTable(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return Array(9).fill().map(() => Array(9).fill(0));
  const grid = [];
  const rows = table.querySelectorAll('tr');
  for (let r = 0; r < 9; r++) {
    const row = [];
    const cells = rows[r].querySelectorAll('td');
    for (let c = 0; c < 9; c++) {
      const cell = cells[c];
      const input = cell.querySelector('input');
      if (input) {
        const val = parseInt(input.value);
        row.push(isNaN(val) ? 0 : val);
      } else {
        row.push(parseInt(cell.textContent) || 0);
      }
    }
    grid.push(row);
  }
  return grid;
}

// Core backtracking solver (modifies board in place, returns boolean)
function solveSudokuBacktrack(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudokuBacktrack(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValidPlacement(board, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num || board[x][col] === num) return false;
  }
  const sr = Math.floor(row / 3) * 3;
  const sc = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[sr + i][sc + j] === num) return false;
    }
  }
  return true;
}

// Attach keyboard navigation to a specific grid
function attachGridNavigation(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const handleKey = (e) => {
    const active = document.activeElement;
    if (!active || active.tagName !== 'INPUT' || !table.contains(active)) return;
    const key = e.key;
    if (/^[1-9]$/.test(key)) {
      e.preventDefault();
      active.value = key;
      active.dispatchEvent(new Event('input'));
    }
    if (key === 'Delete' || key === 'Backspace') {
      e.preventDefault();
      active.value = '';
      active.dispatchEvent(new Event('input'));
    }
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      e.preventDefault();
      const td = active.closest('td');
      const tr = td.closest('tr');
      const rowIdx = Array.from(tr.parentNode.children).indexOf(tr);
      const colIdx = Array.from(tr.children).indexOf(td);
      let newRow = rowIdx, newCol = colIdx;
      if (key === 'ArrowUp') newRow--;
      if (key === 'ArrowDown') newRow++;
      if (key === 'ArrowLeft') newCol--;
      if (key === 'ArrowRight') newCol++;
      if (newRow >= 0 && newRow < 9 && newCol >= 0 && newCol < 9) {
        const nextCell = table.rows[newRow]?.cells[newCol];
        const nextInput = nextCell?.querySelector('input');
        if (nextInput) nextInput.focus();
      }
    }
  };
  document.removeEventListener('keydown', handleKey);
  document.addEventListener('keydown', handleKey);
}