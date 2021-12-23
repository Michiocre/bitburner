/*
It is possible write four as a sum in exactly four different ways:

3 + 1
2 + 2
2 + 1 + 1
1 + 1 + 1 + 1

How many different ways can the number 37 be written as a sum of at least two positive integers?
*/

/** @param {import("../.").NS} ns */
export async function main(ns) {
    let contract = ns.args[0];
    let server = ns.args[1];

    let data = ns.codingcontract.getData(contract, server);

    let anwser = solve(data, ns);

    //let response = "NOT YET IMPLEMENTED";
    let response = ns.codingcontract.attempt(anwser, contract, server, {
        returnReward: true,
    });

    if (response) {
        ns.tprint(response);
    } else {
        ns.tprint("FAILED ATTEMPT");
        ns.tprintf("Data %i", data);
        ns.tprintf("Anwser %i", anwser);
    }
}

/**
 * @param {import("../.").NS} ns
 * @param {Number} n
 */
function solve(n, ns) {
    let partitionList = new Array(n + 1).fill(0);
    partitionList[0] = 1;

    for (let i = 1; i <= n - 1; i++) {
        for (let j = i; j <= n; j++) {
            partitionList[j] += partitionList[j - i];
        }
    }
    return partitionList[n];
}
