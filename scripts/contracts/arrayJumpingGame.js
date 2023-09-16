/*
You are given the following array of integers:

0,10,0,0,0,4,7,9,7,7,1,6,5

Each element in the array represents your MAXIMUM jump length at that position. 
This means that if you are at position i and your maximum jump length is n, 
you can jump to any position from i to i+n. 

Assuming you are initially positioned at the start of the array, 
determine whether you are able to reach the last index exactly.

Your answer should be submitted as 1 or 0, representing true and false respectively
*/

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {

    let contract = ns.args[0];
    let server = ns.args[1];

    let data = ns.codingcontract.getData(contract, server);

    let anwser = solve(data);

    //let response = anwser;
    let response = ns.codingcontract.attempt(anwser, contract, server, { returnReward: true });

    if (response) {
        ns.tprint(response);
    } else {
        ns.tprint('FAILED ATTEMPT');
        ns.tprintf('Data: %j', data);
        ns.tprintf('My Anwser: %i', anwser);
    }
}

/**
 * @param {Number} pos
 * @param {Number[]} list
 * @param {Number} anwser
 */
export function solve(list) {
    let pos = 0;
    let power = list[0];
    while (power > 0) {
        power--;
        pos++;
        if (pos >= list.length) {
            return 1;
        }
        if (list[pos] > power) {
            power = list[pos]
        }
    }
    return 0;
}
