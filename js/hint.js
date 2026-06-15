/**
 * SudokuForge – Advanced Hint Engine
 * - Always returns a hint (even for Diabolical puzzles)
 * - Detects when the puzzle is fully solved
 */

function getHint(userGrid, solutionGrid) {
    // 1. Check if the puzzle is already fully solved
    let isComplete = true;
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (userGrid[r][c] === 0) {
                isComplete = false;
                break;
            }
            if (userGrid[r][c] !== solutionGrid[r][c]) {
                // incorrect filled cell – puzzle not solved
                isComplete = false;
                break;
            }
        }
    }
    if (isComplete) {
        return {
            error: true,
            message: "🏆 All done! You've solved the puzzle! 🎉"
        };
    }

    // 2. Check for any incorrect numbers (conflicts)
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const val = userGrid[r][c];
            if (val !== 0 && val !== solutionGrid[r][c]) {
                return {
                    error: true,
                    message: "⚠️ Some numbers are wrong. Fix them before asking for a hint."
                };
            }
        }
    }

    // 3. Try to find a naked single (logical deduction)
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (userGrid[r][c] === 0) {
                let candidates = [];
                for (let num = 1; num <= 9; num++) {
                    if (isValidPlacement(userGrid, r, c, num)) {
                        candidates.push(num);
                    }
                }
                if (candidates.length === 1) {
                    return {
                        row: r,
                        col: c,
                        value: candidates[0],
                        message: `💡 Logical hint: cell (${r+1},${c+1}) must be ${candidates[0]}.`
                    };
                }
            }
        }
    }

    // 4. Fallback for Diabolical / hard puzzles: give the correct number for the first empty cell
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (userGrid[r][c] === 0) {
                const correctValue = solutionGrid[r][c];
                return {
                    row: r,
                    col: c,
                    value: correctValue,
                    message: `✨ Hint (solution-based): cell (${r+1},${c+1}) should be ${correctValue}.`
                };
            }
        }
    }

    // Should never reach here because we already checked for completeness
    return {
        error: true,
        message: "No hint available – the puzzle seems unsolvable or already complete."
    };
}

// Reuse the same validation logic from common.js (or duplicate for standalone)
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