export function rankingAlgorithm(points: number, publicSince: Date): number {
  const now = new Date();
  const milliseconds = Math.abs(now.getTime() - publicSince.getTime());
  const hours = milliseconds / (3600 * 1000);

  return points / (hours + 2) ** 1.8;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('increases if the sudoku gets more points', () => {
    const date = new Date();
    expect(rankingAlgorithm(100, date)).toBeLessThan(rankingAlgorithm(101, date));
  });

  it('increases the points for newer sudokus', () => {
    const date1 = new Date(2022, 11, 24);
    const date2 = new Date(2022, 11, 25);
    expect(rankingAlgorithm(100, date1)).toBeLessThan(rankingAlgorithm(100, date2));
  });
}
