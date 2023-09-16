/*
How many different distinct ways can the number 133 be written as a sum of integers contained in the set:

 [3,5,7,11,13,15,16,17,19]?

 You may use each integer in the set zero or more times.
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
        ns.tprintf("Data %i", data);
        ns.tprintf("Anwser %i", anwser);
    }
}

export function solve(data) {
    let goal = data[0];
    let numbers = data[1].sort((a, b) => a - b);

    let memory = new Map();

    return addOne(0, goal, numbers, memory);
}

/** @param {Map} memory */
function addOne(current, goal, numbers, memory) {
    if (current == goal) return 1;
    if (current > goal) return 0;

    let key = JSON.stringify([current, numbers]);
    if (memory.has(key)) return memory.get(key);
    
    let count = 0;
    for (let i = 0; i < numbers.length; i++) {
        count += addOne(current + numbers[i], goal, numbers.slice(i, numbers.length), memory);
    }

    memory.set(key, count);
    return count;
}