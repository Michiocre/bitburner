/*
You are located in the top-left corner of the following grid:

  [[0,0,1,1,0,1,0,0,1,0],
   [0,0,0,0,0,0,1,0,0,1],
   [0,0,0,0,0,0,0,0,0,1],
   [0,0,1,0,1,1,1,1,0,0],
   [1,0,0,0,1,0,0,1,0,0],
   [0,0,0,1,1,0,0,0,0,0],
   [0,0,0,0,0,0,1,0,0,0],
   [0,0,0,1,0,0,0,1,0,0]]

You are trying to find the shortest path to the bottom-right corner of the grid, but there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', while empty spaces are denoted by 0.

Determine the shortest path from start to finish, if one exists. The answer should be given as a string of UDLR characters, indicating the moves along the path

NOTE: If there are multiple equally short paths, any of them is accepted as answer. If there is no path, the answer should be an empty string.
NOTE: The data returned for this contract is an 2D array of numbers representing the grid.

Examples:

    [[0,1,0,0,0],
     [0,0,0,1,0]]

Answer: 'DRRURRD'

    [[0,1],
     [1,0]]

Answer: ''
*/

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let contract = ns.args[0];
    let server = ns.args[1];

    let data = ns.codingcontract.getData(contract, server);

    let anwser = solve(data);

    let response = ns.codingcontract.attempt(anwser, contract, server, {returnReward: true,});

    if (response) {
        ns.tprint(response);
    } else {
        ns.tprint("FAILED ATTEMPT");
        ns.tprintf("Data %j", data);
        ns.tprintf("Anwser %s", anwser);
    }
}

export function solve(grid) {
    let open = new Map();
    let closed = new Map();

    open.set('0,0', {
        x: 0,
        y: 0,
        parent: null,
        moveToHere: null,
        gVal: 0,
        hVal: grid.length + grid[0].length,
        fVal: grid.length + grid[0].length
    });

    while (open.size > 0) {
        let node = {fVal: Number.MAX_VALUE, hVal: Number.MAX_VALUE};
        for (const check of open.values()) {
            if (check.fVal < node.fVal) {
                node = check;
            } else if (check.fVal == node.fVal) {
                if (check.hVal < node.hVal) {
                    node = check;
                }
            }
        }
        open.delete(node.x + ',' + node.y);
        closed.set(node.x + ',' + node.y, node);

        if (node.x == (grid[0].length -1) && node.y == (grid.length -1)) {
            break;
        }

        let neighbors = [];
        if (node.x > 0) neighbors.push({x: node.x - 1, y: node.y, move: 'L'});
        if (node.y > 0) neighbors.push({x: node.x, y: node.y - 1, move: 'U'});
        if (node.x < (grid[0].length - 1)) neighbors.push({x: node.x + 1, y: node.y, move: 'R'});
        if (node.y < (grid.length - 1)) neighbors.push({x: node.x, y: node.y + 1, move: 'D'});

        for (const neighbor of neighbors) {
            if (closed.has(neighbor.x + ',' + neighbor.y)) continue;
            if (grid[neighbor.y][neighbor.x]) continue;
 
            let newNode = calcNode(neighbor.x, neighbor.y, node, neighbor.move, grid);
            if (open.has(newNode.x + ',' + newNode.y)) {
                if (newNode.gVal < open.get(newNode.x + ',' + newNode.y).gVal) {
                    open.set(newNode.x + ',' + newNode.y, newNode);
                }
            } else {
                open.set(newNode.x + ',' + newNode.y, newNode);
            }
        }
    }

    let solution = '';

    if (closed.has((grid[0].length - 1) + ',' + (grid.length - 1))) {
        let node = closed.get((grid[0].length - 1) + ',' + (grid.length - 1));
        while (node.parent != null) {
            solution = node.moveToHere + solution;
            node = node.parent;
        }
        return solution;
    } else {
        return '';
    }
}

function calcNode(x, y, parent, move, grid) {
    let gVal = parent.gVal + 1;
    let hVal = (grid.length + grid[0].length) - (x + y);

    let fVal = gVal + hVal;

    return {
        x: x,
        y: y,
        parent: parent,
        moveToHere: move,
        gVal: gVal,
        hVal: hVal,
        fVal: fVal
    }
}