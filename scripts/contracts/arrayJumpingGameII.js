/*
You are given the following array of integers:

6,5,1,2,6,2,2,3,4,2,4,2,5,1,2,1,1,4,4,0,3,2

Each element in the array represents your MAXIMUM jump length at that position. 
This means that if you are at position i and your maximum jump length is n, you can jump to any position from i to i+n. 

Assuming you are initially positioned at the start of the array, determine the minimum number of jumps to reach the end of the array.

If it's impossible to reach the end, then the answer should be 0.
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
        ns.tprintf('Data: %j', data);
        ns.tprintf('My Anwser: %i', anwser);
    }
}

export function solve(data) {
    let jumpMap = new Map();
    jumpMap.set(0, 0);
    let queue = new Set();
    queue.add(0);

    while(queue.size > 0) {
        let index = queue.values().next().value;
        queue.delete(index);
        let currentJumps = jumpMap.get(index);
        let jumpDist = data[index];

        for (let i = index + 1; i <= (index + jumpDist); i++) {
            queue.add(i);
            let newJumps = currentJumps + 1;
            if (jumpMap.has(i)) {
                if (newJumps < jumpMap.get(i)) {
                    jumpMap.set(i, newJumps);
                }
            } else {
                jumpMap.set(i, newJumps);
            }
        }
    }

    if (jumpMap.has(data.length - 1)) {
        return jumpMap.get(data.length - 1);
    }
    return 0;
}