export function numberSquish(number, bytes) {
    if (number == 0) {
        return '0';
    }
    let letters = bytes ? ['GB', 'TB', 'PB'] : ['', 'k', 'm', 'b', 't'];
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

    return number.toLocaleString('en-UK', { maximumFractionDigits: 3 }) + letter;
}

console.log(numberSquish(100));
console.log(numberSquish(5000));
console.log(numberSquish(1238123));
console.log(numberSquish(-0.5));
console.log(numberSquish(0.9159999999999995));
console.log(numberSquish(308933843689));
console.log(numberSquish(0));
console.log(numberSquish(-10550));
