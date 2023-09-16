/*
You are given the following data, representing a graph:
 [10,[[1,9],[0,9],[8,9],[4,8],[0,4],[3,5],[7,9],[3,9],[2,5],[1,4],[3,4]]]
 Note that "graph", as used here, refers to the field of graph theory, and has no relation to statistics or plotting. 
 The first element of the data represents the number of vertices in the graph. Each vertex is a unique number between 0 and 9. 
 The next element of the data represents the edges of the graph. Two vertices u,v in a graph are said to be adjacent if there exists an edge [u,v]. 
 Note that an edge [u,v] is the same as an edge [v,u], as order does not matter. 
 You must construct a 2-coloring of the graph, meaning that you have to assign each vertex in the graph a "color", either 0 or 1, 
 such that no two adjacent vertices have the same color. 
 
 Submit your answer in the form of an array, where element i represents the color of vertex i. 
 If it is impossible to construct a 2-coloring of the given graph, instead submit an empty array.

 Examples:

 Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]
 Output: [0, 0, 1, 1]

 Input: [3, [[0, 1], [0, 2], [1, 2]]]
 Output: []
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
    let amount = data[0];
    let vertices = data[1];

    let colors = [];
    for (let i = 0; i < amount; i++) {
        colors.push(null);
    }

    let firstV = vertices.shift();

    colors[firstV[0]] = 0;
    colors[firstV[1]] = 1;

    while (true) {
        let i = 0;
        let found = false;
        for (i = 0; i < vertices.length; i++) {
            let colorA = colors[vertices[i][0]];
            let colorB = colors[vertices[i][1]];
            if (colorA != null) {
                found = true;
                if (colorB == null) {
                    colors[vertices[i][1]] = (colorA + 1) % 2;
                } else if (colorA == colorB) {
                    return [];
                }
            } else if (colorB != null) {
                found = true
                if (colorA == null) {
                    colors[vertices[i][0]] = (colorB + 1) % 2;
                }
            }

            if (found) {
                break;
            }
        }

        if (!found) {
            if (vertices.length > 0) {
                let firstV = vertices.shift();

                colors[firstV[0]] = 0;
                colors[firstV[1]] = 1;
            } else {
                break;
            }
        }

        vertices.splice(i, 1);
    }
    
    return colors;
}