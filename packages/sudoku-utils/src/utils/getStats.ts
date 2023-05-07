import type { SudokuStats } from '@octopuzzles/models';

export function getStats(stats?: SudokuStats): {
  viewCount: number;
  solveCount: number;
  userDifficulty: number | null;
} {
  let viewCount = 0;
  let solveCount = 0;
  let difficultyTotal = 0;
  let difficultyCount = 0;
  stats?.forEach((s) => {
    if (s.lastViewedOn != null) {
      ++viewCount;
    }
    if (s.solvedOn != null) {
      ++solveCount;
    }
    if (s.difficulty != null) {
      difficultyTotal += s.difficulty;
      ++difficultyCount;
    }
  });
  return {
    viewCount,
    solveCount,
    userDifficulty: difficultyCount > 0 ? Math.round(difficultyTotal / difficultyCount) : null
  };
}
