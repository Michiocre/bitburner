/*
Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to earlier parts of the data. 
In this variant of LZ, data is encoded in two types of chunk. 
Each chunk begins with a length L, encoded as a single ASCII digit from 1 to 9, followed by the chunk data, which is either:

1. Exactly L characters, which are to be copied directly into the uncompressed data.
2. A reference to an earlier part of the uncompressed data. To do this, the length is followed by a second ASCII digit X: 
each of the L output characters is a copy of the character X places before it in the uncompressed data.

For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character is the start of a new chunk. 
The two chunk types alternate, starting with type 1, and the final chunk may be of either type.

You are given the following input string:
    hW0fu81futxSGOKutxSxSGOjJOr1HWa2Wa2Wa2Wm66WHWa2WmAcc6psyXk12sRbbThdmRbwfId1C3Y
Encode it using Lempel-Ziv encoding with the minimum possible output length.

Examples (some have other possible encodings of minimal length):
    abracadabra     ->  7abracad47 
    mississippi     ->  4miss433ppi
    aAAaAAaAaAA     ->  3aAA53035
    2718281828      ->  627182844
    abcdefghijk     ->  9abcdefghi02jk
    aaaaaaaaaaaa    ->  3aaa91
    aaaaaaaaaaaaa   ->  1a91031
    aaaaaaaaaaaaaa  ->  1a91041
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

export function solve(str) {
    const repetitions = findRepetitions(str);
    const bestLStartingAtPosition = new Array(str.length);
    const bestZStartingAtPosition = new Array(str.length);

    for (let i = str.length - 1; i >= 0; i--) {
        const slice = str.slice(i);

        // Try L chunk
        let bestWithLChunkAtI = "";
        if (slice.length <= 9) {
            bestWithLChunkAtI = `${slice.length}${slice}`;
        }

        for (let j = 1; j <= 9 && i + j < str.length; j++) {
            const bestZChunkAtJ = bestZStartingAtPosition[i + j];
            const lChunk = `${j}${slice.slice(0, j)}${bestZChunkAtJ}`;
            if (lChunk.length < bestWithLChunkAtI.length || !bestWithLChunkAtI) {
                bestWithLChunkAtI = lChunk;
            }
        }

        // Try Z chunk
        let bestWithZChunkAtI = "0" + bestWithLChunkAtI;

        if (repetitions[i]) {
            const zChunkAtI = `${repetitions[i].length}${repetitions[i].backChars}`;
            const lChunkAfterRepetition =
            bestLStartingAtPosition[i + repetitions[i].length] ?? "";
            const withZChunkAtI = zChunkAtI + lChunkAfterRepetition;
            if (withZChunkAtI.length < bestWithZChunkAtI.length) {
                bestWithZChunkAtI = withZChunkAtI;
            }
        }

        const lChunkWith0Start = `0${bestWithZChunkAtI}`;
        if (lChunkWith0Start.length < bestWithLChunkAtI.length) {
            bestWithLChunkAtI = lChunkWith0Start;
        }

        bestLStartingAtPosition[i] = bestWithLChunkAtI;
        bestZStartingAtPosition[i] = bestWithZChunkAtI;
    }

    return bestLStartingAtPosition[0];
}

function findRepetitions(str) {
    const result = new Array(str.length);
    for (let currentPos = 1; currentPos < str.length; currentPos++) {
        for (
            let backChars = 1;
            backChars <= 9 && currentPos - backChars >= 0;
            backChars++
        ) {
            for (let length = 1; length <= 9; length++) {
                if (
                    str.slice(currentPos - backChars, currentPos - backChars + length) ===
                    str.slice(currentPos, currentPos + length)
                ) {
                    if (!result[currentPos] || result[currentPos].length < length) {
                        result[currentPos] = { backChars, length };
                    }
                }
            }
        }
    }
    return result;
}