/*
You are in a grid with 4 rows and 10 columns,
and you are positioned in the top-left corner of that grid. 
You are trying to reach the bottom-right corner of the grid, 
but you can only move down or right on each step. 
Determine how many unique paths there are from start to finish.

NOTE: The data returned for this contract is an array with the number of rows and columns:

[4, 10]
*/

/** @param {import("../.").NS} ns */
export async function main(ns) {
    let contract = ns.args[0];
    let server = ns.args[1];

    let data = ns.codingcontract.getData(contract, server);

    let anwser = step(0, 0, data);

    //let response = "NOT YET IMPLEMENTED";
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

/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number[]} dimensions
 * @returns
 */
function step(x, y, dimensions) {
    if (y + 1 === dimensions[0] && x + 1 === dimensions[1]) {
        return 1;
    }

    let pathCounter = 0;

    if (y + 1 < dimensions[0]) {
        pathCounter += step(x, y + 1, dimensions);
    }

    if (x + 1 < dimensions[1]) {
        pathCounter += step(x + 1, y, dimensions);
    }

    return pathCounter;
}
