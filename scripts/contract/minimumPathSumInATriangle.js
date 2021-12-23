/*
Given a triangle, find the minimum path sum from top to bottom. 
In each step of the path, you may only move to adjacent numbers in the row below. 
The triangle is represented as a 2D array of numbers:

[
            [7],
           [3,6],
          [6,4,2],
         [6,1,1,9],
        [4,8,2,8,8],
       [2,3,4,4,6,9],
      [1,4,2,5,4,6,3],
     [7,9,8,4,4,7,6,2],
    [9,1,9,6,7,2,7,6,7],
   [6,1,5,5,2,1,4,4,5,7],
  [4,1,7,1,9,3,6,5,3,5,5]
]

 Example: If you are given the following triangle:

[
     [2],
    [3,4],
   [6,5,7],
  [4,1,8,3]
]

 The minimum path sum is 11 (2 -> 3 -> 5 -> 1).
*/

/** @param {import("../.").NS} ns */
export async function main(ns) {
    let contract = ns.args[0];
    let server = ns.args[1];

    let data = ns.codingcontract.getData(contract, server);
    let anwser = solve(data, 0, 0);

    //let response = anwser;
    let response = ns.codingcontract.attempt(anwser, contract, server, { returnReward: true });

    if (response) {
        ns.tprint(response);
    } else {
        ns.tprint('FAILED ATTEMPT');
        ns.tprintf('Data %j', data);
        ns.tprintf('Anwser %i', anwser);
    }
}

/**
 * @param {Number[][]} data
 */
function solve(data, x, y) {
    if (y === data.length - 1) {
        return data[y][x];
    }

    return data[y][x] + Math.min(solve(data, x, y + 1), solve(data, x + 1, y + 1));
}
