/*
Given the following integer array, find the contiguous subarray (containing at least one number) which has the largest sum and return that sum. 
'Sum' refers to the sum of all the numbers in the subarray.

6,9,1,-10,1,-6,9,-1,-3,-4,1,10,-4,-7,-7,5,-5,-9
*/

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let contract = ns.args[0];
    let server = ns.args[1];

    let data = ns.codingcontract.getData(contract, server);

    let anwser = solve(data);

    //let response = anwser;
    let response = ns.codingcontract.attempt(anwser, contract, server, {
        returnReward: true,
    });

    if (response) {
        ns.tprint(response);
    } else {
        ns.tprint('FAILED ATTEMPT');
        ns.tprintf('Data %j', data);
        ns.tprintf('Anwser %i', anwser);
    }
}

export function solve(data) {
    let currentSolution = [];
    let bestSum = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < data.length; i++) {
        let sum = 0;
        for (let j = i; j < data.length; j++) {
            sum += data[j];
            if (sum > bestSum) {
                bestSum = sum;
                currentSolution = data.slice(i, j + 1);
            }
        }
    }
    return bestSum;
}
