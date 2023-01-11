import type { Color } from '$models/Sudoku';
import type { HexColor } from './types';

function deltaE(rgbA: Rgb, rgbB: Rgb): number {
	const labA = rgb2lab(rgbA);
	const labB = rgb2lab(rgbB);
	const deltaL = labA[0] - labB[0];
	const deltaA = labA[1] - labB[1];
	const deltaB = labA[2] - labB[2];
	const c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
	const c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
	const deltaC = c1 - c2;
	let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
	deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
	const sc = 1.0 + 0.045 * c1;
	const sh = 1.0 + 0.015 * c1;
	const deltaLKlsl = deltaL / 1.0;
	const deltaCkcsc = deltaC / sc;
	const deltaHkhsh = deltaH / sh;
	const i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
	return i < 0 ? 0 : Math.sqrt(i);
}

function rgb2lab(rgb: Rgb): [number, number, number] {
	let r = rgb[0] / 255;
	let g = rgb[1] / 255;
	let b = rgb[2] / 255;
	let x: number;
	let y: number;
	let z: number;
	r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
	g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
	b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
	x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
	y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
	z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
	x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
	return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

function convertToRGB(hex: HexColor): Rgb {
	const hexNumbers = hex.slice(1);

	const aRgbHex = hexNumbers.match(/.{1,2}/g) as RegExpMatchArray;
	return [parseInt(aRgbHex[0], 16), parseInt(aRgbHex[1], 16), parseInt(aRgbHex[2], 16)];
}

type Rgb = [number, number, number];

const colors: [Color, Rgb][] = [
	['Black', [0, 0, 0]],
	['Blue', [32, 175, 210]],
	['Gray', [113, 113, 122]],
	['Green', [118, 190, 54]],
	['Orange', [255, 165, 0]],
	['Purple', [129, 39, 219]],
	['Red', [238, 73, 86]],
	// ['White', [255, 255, 255]], // Remove white, as that is rarely what we want
	['Yellow', [250, 204, 21]]
];

/**
 * Finds the one of the 9 standard colors that are closest to he color given
 */
export function closestColor(color: HexColor): Color {
	const rgb1 = convertToRGB(color);

	let closest: Color = colors[0][0];
	let closestDistance = 100000000;

	for (const [color, rgb2] of colors) {
		const d = deltaE(rgb1, rgb2);
		if (d < closestDistance) {
			closest = color;
			closestDistance = d;
		}
	}

	return closest;
}
