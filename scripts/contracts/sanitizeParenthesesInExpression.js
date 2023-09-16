/*
You are attempting to solve a Coding Contract. You have 9 tries remaining, after which the contract will self-destruct.


Given the following string:

())aa)))(

remove the minimum number of invalid parentheses in order to validate the string. If there are multiple minimal ways to validate the string, provide all of the possible results. The answer should be provided as an array of strings. If it is impossible to validate the string the result should be an array with only an empty string.

IMPORTANT: The string may contain letters, not just parentheses. Examples:
"()())()" -> ["()()()", "(())()"]
"(a)())()" -> ["(a)()()", "(a())()"]
")(" -> [""]
*/

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let contract = ns.args[0];
    let server = ns.args[1];

    let data = ns.codingcontract.getData(contract, server);
    let anwser = solve(data);

    if (anwser.length == 0) {
        anwser.push(data.replaceAll('(', '').replaceAll(')', ''));
    }

    let response = ns.codingcontract.attempt(anwser, contract, server, { returnReward: true });

    if (response) {
        ns.tprint(response);
    } else {
        ns.tprint('FAILED ATTEMPT');
        ns.tprintf('Data: %s', data);
        ns.tprintf('My Anwser: %j', anwser);
    }
}

function generateVariants(str, char) {
    const variants = new Set();
    const matchStr = new RegExp(`\\${char}`, `g`);
    const matches = [...str.matchAll(matchStr)];
    for (let match of matches) {
        variants.add(`${str.slice(0, match.index)}${str.slice(match.index + 1)}`);
    }
    return variants;
}

export function solve(data) {
    let anwser = _solve(data);

    if (anwser.length == 0) {
        anwser.push(data.replaceAll('(', '').replaceAll(')', ''));
    }

    return anwser;
}

function _solve(data) {
    data = data.replace(/^\)+/, '').replace(/\(+$/, '');

    //Fixing Close
    let possible = [];

    let open = 0;
    if (data[0] == '(') open++;

    if (data[0] != undefined) {
        possible.push(data[0]);
    }

    for (let i = 1; i < data.length; i++) {
        let char = data[i];
        
        if (char == ')' && open <= 0) {
            let newPos = new Set();

            for (const pos of possible) {
                generateVariants(pos + char, char).forEach(el => newPos.add(el));
            }

            possible = [...newPos];
            continue;
        }
        
        if (char == '(') open++;
        if (char == ')') open--;

        possible = possible.map(pos => {
            return pos + char;
        });
    }

    let solutions = [];

    //Fix Open
    for (const pos of possible) {
        let possible2 = [];
        let close = 0;
        if (pos[pos.length - 1] == ')') close++;

        possible2.push(pos[pos.length - 1]);

        for (let i = pos.length - 2; i >= 0 ; i--) {
            let char = pos[i];
            
            if (char == '(' && close <= 0) {
                let newPos2 = new Set();

                for (const pos2 of possible2) {
                    generateVariants(char + pos2, char).forEach(el => newPos2.add(el));
                }

                possible2 = [...newPos2];
                continue;
            }
            
            if (char == ')') close++;
            if (char == '(') close--;

            possible2 = possible2.map(pos2 => {
                return char + pos2;
            });
        }

        solutions.push(...possible2);
    }

    return solutions;
}