export function borderCluesFontSize(s: string, radius: number): string {
	let size = 0;
	switch (s.length) {
		case 1:
			size = 2;
			break;
		case 2:
			size = 1.2;
			break;
		case 3:
			size = 0.8;
			break;
		case 4:
			size = 0.5;
			break;
		case 0:
		default:
			break;
	}

	return (size * radius) / 32 + 'rem';
}
