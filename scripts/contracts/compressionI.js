/*
Run-length encoding (RLE) is a data compression technique which encodes data as a series of runs of a repeated single character. 
Runs are encoded as a length, followed by the character itself. 
Lengths are encoded as a single ASCII digit; runs of 10 characters or more are encoded by splitting them into multiple runs.

 You are given the following input string:
    GGGGGuyT11pppppppppppppb6xEuDDDDDWWWWWWWWWWWWWWNNTPPDBBBBBz66llllllllllllZZITxxxxxxxffffffe
 Encode it using run-length encoding with the minimum possible output length.

 Examples:
 aaaaabccc            ->  5a1b3c
 aAaAaA               ->  1a1A1a1A1a1A
 111112333            ->  511233
 zzzzzzzzzzzzzzzzzzz  ->  9z9z1z  (or 9z8z2z, etc.)
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
    let currentChar = data[0];
    let currentLength = 1;

    for (let i = 1; i < data.length; i++) {
        if (data[i] != currentChar) {
            output += currentLength + currentChar;
            currentChar = data[i];
            currentLength = 1;
        } else {
            currentLength++;
            if (currentLength == 10) {
                output += (currentLength - 1) + currentChar;
                currentLength = 1;
            }
        }
    }
    
    output += currentLength + currentChar;
    return output;
}