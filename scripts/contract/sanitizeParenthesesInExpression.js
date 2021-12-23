/*
Sanitize Parentheses in Expression

Given the following string:

(((a((()a

remove the minimum number of invalid parentheses in order to validate the string. 
If there are multiple minimal ways to validate the string, provide all of the possible results. 
The answer should be provided as an array of strings. 
If it is impossible to validate the string the result should be an array with only an empty string.

IMPORTANT: The string may contain letters, not just parentheses. Examples:
"()())()" -> [()()(), (())()]
"(a)())()" -> [(a)()(), (a())()]
")(" -> [""]
*/

/** @param {import("../.").NS} ns */
export async function main(ns) {
    let contract = ns.args[0];
    let server = ns.args[1];

    let data = ns.codingcontract.getData(contract, server);
    let anwser = solve(data, ns);

    anwser = '[' + anwser.join(', ') + ']';

    if (anwser === '[]') {
        anwser = '[""]';
    }

    //let response = answer;
    let response = ns.codingcontract.attempt(anwser, contract, server, { returnReward: true });

    if (response) {
        ns.tprint(response);
    } else {
        ns.tprint('FAILED ATTEMPT');
        ns.tprintf('Data %s', data);
        ns.tprintf('Anwser %s', anwser);
    }
}

/**
 * @param {String} brackets
 * @returns {Boolean}
 */
function validate(brackets) {
    let counter = 0;
    for (let char of brackets) {
        if (char === '(') counter++;
        if (char === ')') counter--;
        if (counter < 0) return false;
    }
    if (counter != 0) return false;
    return true;
}

/**
 * @param {String} brackets
 * @returns {String[]}
 */
function solve(brackets, ns) {
    if (!brackets.includes('(') || !brackets.includes(')')) {
        return [];
    }
    let solutions = [];
    let unvalidated = [];
    for (let j = 0; j < brackets.length; j++) {
        if (brackets[j] != '(' && brackets[j] != ')') {
            continue;
        }
        let newBrackets = brackets.substring(0, j) + brackets.substring(j + 1);

        if (validate(newBrackets)) {
            if (!solutions.includes(newBrackets)) {
                solutions.push(newBrackets);
            }
        } else {
            if (!unvalidated.includes(newBrackets)) {
                unvalidated.push(newBrackets);
            }
        }
    }

    if (solutions.length > 0) {
        return solutions;
    }

    for (let uBracket of unvalidated) {
        let nextResult = solve(uBracket, ns);
        if (nextResult.length > 0) {
            return nextResult;
        }
    }

    return [];
}
