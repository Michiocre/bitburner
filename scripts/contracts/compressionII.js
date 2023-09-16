/*
Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to earlier parts of the data. 
In this variant of LZ, data is encoded in two types of chunk. 
Each chunk begins with a length L, encoded as a single ASCII digit from 1 to 9, followed by the chunk data, which is either:

1. Exactly L characters, which are to be copied directly into the uncompressed data.
2. A reference to an earlier part of the uncompressed data. To do this, the length is followed by a second ASCII digit X: 
    each of the L output characters is a copy of the character X places before it in the uncompressed data.

For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character is the start of a new chunk. 
The two chunk types alternate, starting with type 1, and the final chunk may be of either type.

You are given the following LZ-encoded string:
    9RueriaoHF02WV169y7uMTT1h007Xtla6gd517h71hh7L953I6n4446n7g395B3t1M3516
Decode it and output the original string.

Example: decoding '5aaabb450723abb' chunk-by-chunk
    5aaabb           ->  aaabb
    5aaabb45         ->  aaabbaaab
    5aaabb450        ->  aaabbaaab
    5aaabb45072      ->  aaabbaaababababa
    5aaabb450723abb  ->  aaabbaaababababaabb
*/

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let contract = ns.args[0];
    let server = ns.args[1];

    let data = ns.codingcontract.getData(contract, server);
    let anwser = solve(data);

    let response = ns.codingcontract.attempt(anwser, contract, server, { returnReward: true });

    if (response) {
        ns.tprint(response);
    } else {
        ns.tprint('FAILED ATTEMPT');
        ns.tprintf('Data: %s', data);
        ns.tprintf('My Anwser: %s', anwser);
    }
}

/**
 * @param {String} data
 * @returns {String}
 */
export function solve(data) {
    let output = '';
    let pos = 0;
    let copy = true;

    while (pos < data.length) {
        if (data[pos] == '0') {
            copy = !copy;
            pos++;
            continue;
        }

        if (copy) {
            let amount = parseInt(data[pos]);
            output += data.slice(pos + 1, pos + 1 + amount);
            copy = !copy;
            pos += amount + 1;
        } else {
            let amount = parseInt(data[pos]);
            let offset = parseInt(data[pos + 1]);

            for (let i = 0; i < amount; i++) {
                output += output[output.length - (offset)]
            }
            copy = !copy;
            pos += 2;
        }
    }
    return output;
}