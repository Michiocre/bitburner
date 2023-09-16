/**
 You are given the following decimal Value: 
 1257096387832 
 Convert it to a binary representation and encode it as an 'extended Hamming code'. Eg:
  Value 8 is expressed in binary as '1000', which will be encoded with the pattern 'pppdpddd', where p is a parity bit and d a data bit. The encoding of
 8 is 11110000. As another example, '10101' (Value 21) will result into (pppdpdddpd) '1001101011'.
 The answer should be given as a string containing only 1s and 0s.
 NOTE: the endianness of the data bits is reversed in relation to the endianness of the parity bits.
 NOTE: The bit at index zero is the overall parity bit, this should be set last.
 NOTE 2: You should watch the Hamming Code video from 3Blue1Brown, which explains the 'rule' of encoding, 
 including the first index parity bit mentioned in the previous note.

 Extra rule for encoding:
 There should be no leading zeros in the 'data bit' section
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
    data = data.toString(2);

    let hammingCode = [null, null];
    for (let i = 0; i < data.length; i++) {
        if (!(hammingCode.length & (hammingCode.length - 1))) {
            hammingCode.push(null);
        }
        hammingCode.push(Number.parseInt(data[i]));
    }

    for (let i = 1; i < hammingCode.length; i *= 2) {
        let allOfEm = [];
        for (let j = i; j < hammingCode.length; j += (i * 2)) {
            let slice = hammingCode.slice(j, j + i);
            allOfEm = allOfEm.concat(slice);
        }
        allOfEm.shift();
        let parity = allOfEm.reduce((prev, cur) => prev + cur, 0) % 2;
        hammingCode[i] = parity;
    }

    hammingCode.shift();
    let parity = hammingCode.reduce((prev, cur) => prev + cur, 0) % 2;
    hammingCode.unshift(parity);
    
    return hammingCode.join('');
}