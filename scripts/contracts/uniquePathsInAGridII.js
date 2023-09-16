/*
You are located in the top-left corner of the following grid:

0,0,0,0,
0,0,0,0,
0,0,1,0,
0,1,0,0,
0,0,0,0,
0,0,0,0,
0,0,0,0,
0,0,0,0,
1,1,1,0,
0,0,0,0,
0,0,0,0,

 You are trying reach the bottom-right corner of the grid, but you can only move down or right on each step. Furthermore, there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', while empty spaces are denoted by 0.

 Determine how many unique paths there are from start to finish.

 NOTE: The data returned for this contract is an 2D array of numbers representing the grid.
*/

/** @param {import("../../NetscriptDefinitions").NS} ns */
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

export function solve(data) {
    return step(0, 0, data);
}

/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number[][]} grid
 * @returns
 */
function step(x, y, grid) {
    if (y + 1 === grid.length && x + 1 === grid[0].length) {
        return 1;
    }

    let pathCounter = 0;

    if (y + 1 < grid.length && grid[y + 1][x] == 0) {
        pathCounter += step(x, y + 1, grid);
    }

    if (x + 1 < grid[0].length && grid[y][x + 1] == 0) {
        pathCounter += step(x + 1, y, grid);
    }

    return pathCounter;
}
