/*
Given the following array of array of numbers representing a list of intervals, merge all overlapping intervals.

[[12,13],[25,27],[4,6],[14,18],[14,16],[4,9],[25,35],[15,17],[20,22]]

Example:

[[1, 3], [8, 10], [2, 6], [10, 16]]

would merge into [[1, 6], [8, 16]].

The intervals must be returned in ASCENDING order. 
You can assume that in an interval, the first number will always be smaller than the second.
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

/**
 * @param {Number[][]} data
 */
export function solve(_data) {
    let data = _data.slice();
    for (let i = 0; i < data.length - 1; i++) {
        for (let j = i + 1; j < data.length; j++) {
            if (data[i][0] <= data[j][1] && data[i][1] > data[j][1]) {
                let cutJ = data.splice(j, 1)[0];
                if (cutJ[0] < data[i][0]) {
                    data[i][0] = cutJ[0];
                }
                j = i;
                continue;
            }

            if (data[j][0] <= data[i][1] && data[j][1] >= data[i][1]) {
                let cutJ = data.splice(j, 1)[0];
                if (data[i][0] < cutJ[0]) {
                    cutJ[0] = data[i][0];
                }
                data[i] = cutJ;
                j = i;
                continue;
            }
        }
    }

    return data.sort((a, b) => a[0] - b[0]);
}