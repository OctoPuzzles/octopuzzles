import { intervalToDuration } from 'date-fns';

export function rankingAlgorithm(points: number, publicSince: Date): number {
	const now = new Date();
	const timeDifference = intervalToDuration({ start: publicSince, end: now }).hours ?? 0;

	return points / (timeDifference + 2) ** 1.8;
}
