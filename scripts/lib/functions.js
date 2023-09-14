/**
 * @description Squishes numbers so they arent as long.
 * @param {Number} number
 * @param {Boolean} bytes
 * @returns {String}
 */
export function numberSquish(number, bytes) {
    if (number == 0) {
        return bytes ? '0GB' : '0.000';
    }
    let letters = bytes ? ['GB', 'TB', 'PB'] : ['', 'k', 'm', 'b', 't', 'q'];
    let index = Math.floor(Math.log10(Math.abs(number)) / 3);

    if (index > 0) {
        number = number / Math.pow(1000, index);
    }

    let letter;
    if (index >= letters.length) {
        letter = 'ADD MORE LETTER';
    } else if (index < 0) {
        letter = '';
    } else {
        letter = letters[index];
    }

    return number.toLocaleString('en-UK', { maximumFractionDigits: bytes ? 0 : 3, minimumFractionDigits: bytes ? 0 : 3 }) + letter;
}
