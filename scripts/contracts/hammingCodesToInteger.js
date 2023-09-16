/**
You are given the following encoded binary string: 
 '1010001110010000' 

 Treat it as an extended Hamming code with 1 'possible' error at a random index.
 Find the 'possible' wrong bit, fix it and extract the decimal value, which is hidden inside the string.

 Note: The length of the binary string is dynamic, but its encoding/decoding follows Hamming's 'rule'
 Note 2: Index 0 is an 'overall' parity bit. Watch the Hamming code video from 3Blue1Brown for more information
 Note 3: There's a ~55% chance for an altered Bit. So... MAYBE there is an altered Bit 😉
 Note: The endianness of the encoded decimal value is reversed in relation to the endianness of the Hamming code. Where the Hamming code is expressed as little-endian (LSB at index 0), the decimal value encoded in it is expressed as big-endian (MSB at index 0).
 Extra note for automation: return the decimal value as a string
 */

 /** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let contract = ns.args[0];
    let server = ns.args[1];

    let data = ns.codingcontract.getData(contract, server);
    let anwser = solve(data);

    let response = ns.codingcontract.attempt(anwser, contract, server, {
        returnReward: true,
    });

    if (response) {
        ns.tprint(response);
    } else {
        ns.tprint("FAILED ATTEMPT");
        ns.tprintf("Data %j", data);
        ns.tprintf("Anwser %j", anwser);
    }
}

export function solve(data) {
    data = data.split('');

    let x = 0;

    for (let i = 1; i < data.length; i *= 2) {
        let allOfEm = [];
        for (let j = i; j < data.length; j += (i * 2)) {
            let slice = data.slice(j, j + i);
            allOfEm = allOfEm.concat(slice);
        }
        let parity = allOfEm.reduce((prev, cur) => prev + Number.parseInt(cur), 0) % 2;
        if (parity) {
            x += i;
        }
    }

    if (x > 0) {
        if (data[x] == '1') {
            data[x] = '0';
        } else {
            data[x] = '1';
        }
    }

    let parity = data.reduce((prev, cur) => prev + Number.parseInt(cur), 0) % 2;
    if (parity) {
        if (data[0] == '1') {
            data[0] = '0';
        } else {
            data[0] = '1';
        }
    }

    let numberBin = '';

    for (let i = 2; i < data.length; i++) {
        if (!(i & (i - 1))) {
            continue;
        } else {
            numberBin += data[i];
        }
    }
    
    return Number.parseInt(numberBin, 2);
}