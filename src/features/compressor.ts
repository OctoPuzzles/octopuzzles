const f = String.fromCharCode;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function getBaseValue(character: string): number {
	const baseReverseDic: Record<string, Record<string, number>> = {};
	if (!baseReverseDic[ALPHABET]) {
		baseReverseDic[ALPHABET] = {};
		for (let i = 0; i < ALPHABET.length; i++) {
			baseReverseDic[ALPHABET][ALPHABET.charAt(i)] = i;
		}
	}
	return baseReverseDic[ALPHABET][character];
}

export function decompressFromBase64(input: string): unknown | null {
	if (input == null || input == '') return null;
	const jsonString = _decompress(input.length, 32, function (index: number) {
		return getBaseValue(input.charAt(index));
	});

	if (jsonString == null || jsonString === '') return null;

	return JSON.parse(jsonString);
}

function _decompress(
	length: number,
	resetValue: number,
	getNextValue: (index: number) => number
): string | null {
	const dictionary: (string | number | undefined)[] = [0, 1, 2];
	let enlargeIn = 4;
	let dictSize = 4;
	let numBits = 3;
	let entry: string | number | undefined = '';
	const result = [];
	let w = undefined;
	let bits = undefined;
	let resb = undefined;
	let c = undefined;
	const data = { val: getNextValue(0), position: resetValue, index: 1 };

	bits = 0;
	let maxpower = Math.pow(2, 2);
	let power = 1;
	while (power != maxpower) {
		resb = data.val & data.position;
		data.position >>= 1;
		if (data.position == 0) {
			data.position = resetValue;
			data.val = getNextValue(data.index++);
		}
		bits |= (resb > 0 ? 1 : 0) * power;
		power <<= 1;
	}

	switch (bits) {
		case 0:
			bits = 0;
			maxpower = Math.pow(2, 8);
			power = 1;
			while (power != maxpower) {
				resb = data.val & data.position;
				data.position >>= 1;
				if (data.position == 0) {
					data.position = resetValue;
					data.val = getNextValue(data.index++);
				}
				bits |= (resb > 0 ? 1 : 0) * power;
				power <<= 1;
			}
			c = f(bits);
			break;
		case 1:
			bits = 0;
			maxpower = Math.pow(2, 16);
			power = 1;
			while (power != maxpower) {
				resb = data.val & data.position;
				data.position >>= 1;
				if (data.position == 0) {
					data.position = resetValue;
					data.val = getNextValue(data.index++);
				}
				bits |= (resb > 0 ? 1 : 0) * power;
				power <<= 1;
			}
			c = f(bits);
			break;
		case 2:
			return '';
	}
	dictionary[3] = c;
	w = c;
	result.push(c);
	// eslint-disable-next-line no-constant-condition
	while (true) {
		if (data.index > length) {
			return '';
		}

		bits = 0;
		maxpower = Math.pow(2, numBits);
		power = 1;
		while (power != maxpower) {
			resb = data.val & data.position;
			data.position >>= 1;
			if (data.position == 0) {
				data.position = resetValue;
				data.val = getNextValue(data.index++);
			}
			bits |= (resb > 0 ? 1 : 0) * power;
			power <<= 1;
		}

		switch ((c = bits)) {
			case 0:
				bits = 0;
				maxpower = Math.pow(2, 8);
				power = 1;
				while (power != maxpower) {
					resb = data.val & data.position;
					data.position >>= 1;
					if (data.position == 0) {
						data.position = resetValue;
						data.val = getNextValue(data.index++);
					}
					bits |= (resb > 0 ? 1 : 0) * power;
					power <<= 1;
				}

				dictionary[dictSize++] = f(bits);
				c = dictSize - 1;
				enlargeIn--;
				break;
			case 1:
				bits = 0;
				maxpower = Math.pow(2, 16);
				power = 1;
				while (power != maxpower) {
					resb = data.val & data.position;
					data.position >>= 1;
					if (data.position == 0) {
						data.position = resetValue;
						data.val = getNextValue(data.index++);
					}
					bits |= (resb > 0 ? 1 : 0) * power;
					power <<= 1;
				}
				dictionary[dictSize++] = f(bits);
				c = dictSize - 1;
				enlargeIn--;
				break;
			case 2:
				return result.join('');
		}

		if (enlargeIn == 0) {
			enlargeIn = Math.pow(2, numBits);
			numBits++;
		}

		if (dictionary[c]) {
			entry = dictionary[c];
		} else {
			if (c === dictSize) {
				entry = w + (w as string).charAt(0);
			} else {
				return null;
			}
		}
		result.push(entry);

		// Add w+entry[0] to the dictionary.
		dictionary[dictSize++] = w + (entry as string).charAt(0);
		enlargeIn--;

		w = entry;

		if (enlargeIn == 0) {
			enlargeIn = Math.pow(2, numBits);
			numBits++;
		}
	}
}

export function compressToBase64(input: unknown): string {
	if (input == null) return '';
	const jsonString = JSON.stringify(input);
	const res = _compress(jsonString, 6, function (a: number) {
		return ALPHABET.charAt(a);
	});
	switch (res.length % 4) {
		default:
		case 0:
			return res;
		case 1:
			return res + '===';
		case 2:
			return res + '==';
		case 3:
			return res + '=';
	}
}

function _compress(
	uncompressed: string,
	bitsPerChar: number,
	getCharFromInt: (index: number) => string
): string {
	if (uncompressed == null) return '';
	let i: number;
	let value: number;
	const context_dictionary: Record<string, number> = {};
	const context_dictionaryToCreate: Record<string, boolean> = {};
	let context_c = '';
	let context_wc = '';
	let context_w = '';
	let context_enlargeIn = 2;
	let context_dictSize = 3;
	let context_numBits = 2;
	const context_data = [];
	let context_data_val = 0;
	let context_data_position = 0;

	for (let ii = 0; ii < uncompressed.length; ii++) {
		context_c = uncompressed.charAt(ii);
		if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
			context_dictionary[context_c] = context_dictSize++;
			context_dictionaryToCreate[context_c] = true;
		}

		context_wc = context_w + context_c;
		if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc))
			context_w = context_wc;
		else {
			if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
				if (context_w.charCodeAt(0) < 256) {
					for (i = 0; i < context_numBits; i++) {
						context_data_val = context_data_val << 1;
						if (context_data_position == bitsPerChar - 1) {
							context_data_position = 0;
							context_data.push(getCharFromInt(context_data_val));
							context_data_val = 0;
						} else context_data_position++;
					}
					value = context_w.charCodeAt(0);
					for (i = 0; i < 8; i++) {
						context_data_val = (context_data_val << 1) | (value & 1);
						if (context_data_position == bitsPerChar - 1) {
							context_data_position = 0;
							context_data.push(getCharFromInt(context_data_val));
							context_data_val = 0;
						} else context_data_position++;
						value = value >> 1;
					}
				} else {
					value = 1;
					for (i = 0; i < context_numBits; i++) {
						context_data_val = (context_data_val << 1) | value;
						if (context_data_position == bitsPerChar - 1) {
							context_data_position = 0;
							context_data.push(getCharFromInt(context_data_val));
							context_data_val = 0;
						} else context_data_position++;
						value = 0;
					}
					value = context_w.charCodeAt(0);
					for (i = 0; i < 16; i++) {
						context_data_val = (context_data_val << 1) | (value & 1);
						if (context_data_position == bitsPerChar - 1) {
							context_data_position = 0;
							context_data.push(getCharFromInt(context_data_val));
							context_data_val = 0;
						} else context_data_position++;
						value = value >> 1;
					}
				}
				context_enlargeIn--;
				if (context_enlargeIn == 0) {
					context_enlargeIn = Math.pow(2, context_numBits);
					context_numBits++;
				}
				delete context_dictionaryToCreate[context_w];
			} else {
				value = context_dictionary[context_w];
				for (i = 0; i < context_numBits; i++) {
					context_data_val = (context_data_val << 1) | (value & 1);
					if (context_data_position == bitsPerChar - 1) {
						context_data_position = 0;
						context_data.push(getCharFromInt(context_data_val));
						context_data_val = 0;
					} else context_data_position++;
					value = value >> 1;
				}
			}
			context_enlargeIn--;
			if (context_enlargeIn == 0) {
				context_enlargeIn = Math.pow(2, context_numBits);
				context_numBits++;
			}
			context_dictionary[context_wc] = context_dictSize++;
			context_w = String(context_c);
		}
	}

	if (context_w !== '') {
		if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
			if (context_w.charCodeAt(0) < 256) {
				for (i = 0; i < context_numBits; i++) {
					context_data_val = context_data_val << 1;
					if (context_data_position == bitsPerChar - 1) {
						context_data_position = 0;
						context_data.push(getCharFromInt(context_data_val));
						context_data_val = 0;
					} else context_data_position++;
				}
				value = context_w.charCodeAt(0);
				for (i = 0; i < 8; i++) {
					context_data_val = (context_data_val << 1) | (value & 1);
					if (context_data_position == bitsPerChar - 1) {
						context_data_position = 0;
						context_data.push(getCharFromInt(context_data_val));
						context_data_val = 0;
					} else context_data_position++;
					value = value >> 1;
				}
			} else {
				value = 1;
				for (i = 0; i < context_numBits; i++) {
					context_data_val = (context_data_val << 1) | value;
					if (context_data_position == bitsPerChar - 1) {
						context_data_position = 0;
						context_data.push(getCharFromInt(context_data_val));
						context_data_val = 0;
					} else context_data_position++;
					value = 0;
				}
				value = context_w.charCodeAt(0);
				for (i = 0; i < 16; i++) {
					context_data_val = (context_data_val << 1) | (value & 1);
					if (context_data_position == bitsPerChar - 1) {
						context_data_position = 0;
						context_data.push(getCharFromInt(context_data_val));
						context_data_val = 0;
					} else context_data_position++;
					value = value >> 1;
				}
			}
			context_enlargeIn--;
			if (context_enlargeIn == 0) {
				context_enlargeIn = Math.pow(2, context_numBits);
				context_numBits++;
			}
			delete context_dictionaryToCreate[context_w];
		} else {
			value = context_dictionary[context_w];
			for (i = 0; i < context_numBits; i++) {
				context_data_val = (context_data_val << 1) | (value & 1);
				if (context_data_position == bitsPerChar - 1) {
					context_data_position = 0;
					context_data.push(getCharFromInt(context_data_val));
					context_data_val = 0;
				} else context_data_position++;
				value = value >> 1;
			}
		}
		context_enlargeIn--;
		if (context_enlargeIn == 0) {
			context_enlargeIn = Math.pow(2, context_numBits);
			context_numBits++;
		}
	}

	value = 2;
	for (i = 0; i < context_numBits; i++) {
		context_data_val = (context_data_val << 1) | (value & 1);
		if (context_data_position == bitsPerChar - 1) {
			context_data_position = 0;
			context_data.push(getCharFromInt(context_data_val));
			context_data_val = 0;
		} else context_data_position++;
		value = value >> 1;
	}

	// eslint-disable-next-line no-constant-condition
	while (true) {
		context_data_val = context_data_val << 1;
		if (context_data_position == bitsPerChar - 1) {
			context_data.push(getCharFromInt(context_data_val));
			break;
		} else context_data_position++;
	}
	return context_data.join('');
}
