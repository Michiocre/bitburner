/*
You are given the following string which contains only digits between 0 and 9:

50020067805

You are also given a target number of 45. Return all possible ways you can add the +, -, and * operators to the string such that it evaluates to the target number.

The provided answer should be an array of strings containing the valid expressions. The data provided by this problem is an array with two elements. The first element is the string of digits, while the second element is the target number:

["50020067805", 45]

NOTE: Numbers in the expression cannot have leading 0's. In other words, "1+01" is not a valid expression Examples:

Input: digits = "123", target = 6
Output: [1+2+3, 1*2*3]

Input: digits = "105", target = 5
Output: [1*0+5, 10-5]
*/

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let contract = ns.args[0];
    let server = ns.args[1];

    let data = ns.codingcontract.getData(contract, server);
    let anwser = solve(data, ns);

    anwser = '[' + anwser.join(', ') + ']';

    //let response = anwser;
    let response = ns.codingcontract.attempt(anwser, contract, server, {returnReward: true});

    if (response) {
        ns.tprint(response);
    } else {
        ns.tprint('FAILED ATTEMPT');
        ns.tprintf('Data %j', data);
        ns.tprintf('Anwser %s', anwser);
    }
}

/**
 * @param {Array} data
*/ 
export function solve(data) {
    let digits = data[0].split('');
    let goal = data[1];

    let numbers = [];
    generateNumbers(digits, numbers, []);
    let expressions = [];
    for (let numberList of numbers) {
        generateExpressions(numberList, expressions, []);
    }

    let solutions = [];
    for (let expression of expressions) {
        if (solveExpression(expression.slice()) === goal) {
            solutions.push(expression.join(''));
        }
    }
    return solutions;
}

/**
 * @param {Array} expression
*/ 
function solveExpression(expression) {
    let mIndex = [];
    for (let i = expression.length - 2; i > 0 ; i -= 2) {
        if (expression[i] == '*') {
            let n = expression[i-1] * expression[i+1];
            expression.splice(i-1, 3, n);
        }
    }

    while (expression.length >= 3) {
        if (expression[1] == '+') {
            let n = expression[0] + expression[2];
            expression.splice(0, 3, n);
        } else {
            let n = expression[0] - expression[2];
            expression.splice(0, 3, n);
        }
    }

    return expression[0];
}

/**
 * @param {Array} digits
 * @param {Array} allNumbers
 * @param {Array} head 
*/
function generateNumbers(digits, allNumbers, head) {
    for (let i = 1; i <= digits.length; i++) {
        let digitCopy = digits.slice();
        let mergeElements = digitCopy.splice(0, i).join('');

        if (mergeElements[0] == '0' && mergeElements.length > 1) {
            continue;
        }

        let newHead = head.concat([mergeElements]);
        if (digitCopy.length <= 0) {
            for (let j = 0; j < newHead.length; j++) {
                newHead[j] = Number.parseInt(newHead[j])
            }
            allNumbers.push(newHead);
            continue;
        }

        generateNumbers(digitCopy, allNumbers, newHead);
    }
}

/**
 * @param {Array} numbers
 * @param {Array} expressionList
 * @param {Array} head 
*/
function generateExpressions(numbers, expressionList, head) {
    if (numbers.length <= 1) {
        expressionList.push(head.concat(numbers));
        return;
    }

    generateExpressions(numbers.slice(1), expressionList, head.concat(numbers[0], '+'));
    generateExpressions(numbers.slice(1), expressionList, head.concat(numbers[0], '-'));
    generateExpressions(numbers.slice(1), expressionList, head.concat(numbers[0], '*'));
}