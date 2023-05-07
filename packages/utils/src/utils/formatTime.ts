export function formatTime(t: number): string {
  const seconds = `0${t % 60}`.slice(-2);
  const minutes = `0${Math.floor(t / 60) % 60}`.slice(-2);
  const hours = t >= 3600 ? `0${Math.floor(t / 3600) % 24}`.slice(-2) + ':' : '';
  const days = t >= 86400 ? Math.floor(t / 86400) + 'd ' : '';

  return `${days}${hours}${minutes}:${seconds}`;
}
