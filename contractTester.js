import fs from 'fs';
import pkg from 'sprintf-js';
let { vsprintf } = pkg;

let folder = './scripts/contract';
let files = fs.readdirSync(folder);

let functions = {};

for (let file of files) {
    let name = file.split('.')[0];

    functions[name] = await import(folder + '/' + file);
}

let ns = {
    contracts: [
        { id: 0, name: 'test-algorithmicStockTraderI', server: '', anwser: 116, data: [65, 181, 43, 87, 63] },
        {
            id: 1,
            name: 'test-algorithmicStockTraderII',
            server: '',
            anwser: 954,
            data: [126, 6, 43, 158, 4, 147, 41, 100, 100, 119, 143, 73, 7, 129, 46, 158, 6, 129, 160, 124, 126, 179, 41, 44, 68, 1, 88],
        },
        { id: 2, name: 'test1-algorithmicStockTraderII', server: '', anwser: 31, data: [154, 24, 55] },
        { id: 3, name: 'test2-algorithmicStockTraderII', server: '', anwser: 357, data: [154, 24, 55, 164, 82, 1, 135, 64, 147] },
        {
            id: 4,
            name: 'test3-algorithmicStockTraderII',
            server: '',
            anwser: 1496,
            data: [
                6, 122, 131, 130, 81, 77, 119, 196, 187, 5, 98, 44, 19, 188, 99, 75, 19, 128, 136, 134, 99, 113, 114, 36, 23, 25, 36, 49, 183, 26,
                124, 72, 30, 124, 114, 36, 64, 190, 52, 158, 18, 196, 174, 62, 130, 13,
            ],
        },
        {
            id: 5,
            name: 'test-algorithmicStockTraderIII',
            server: '',
            anwser: 373,
            data: [
                133, 31, 25, 6, 82, 118, 68, 83, 95, 164, 123, 8, 139, 16, 37, 138, 168, 90, 21, 185, 10, 108, 93, 154, 1, 176, 80, 66, 195, 34, 68,
                169, 49, 55,
            ],
        },
        {
            id: 6,
            name: 'test1-algorithmicStockTraderIII',
            server: '',
            anwser: 376,
            data: [
                134, 163, 146, 149, 171, 167, 168, 162, 187, 66, 49, 78, 89, 8, 189, 30, 87, 70, 198, 68, 13, 167, 78, 188, 3, 144, 30, 142, 189, 92,
                6, 86, 68, 79,
            ],
        },
        {
            id: 7,
            name: 'test-algorithmicStockTraderIV',
            server: '',
            anwser: 332,
            data: [
                2,
                [
                    23, 148, 145, 145, 107, 71, 24, 67, 95, 82, 162, 58, 145, 135, 184, 130, 175, 41, 184, 90, 43, 146, 15, 113, 97, 55, 102, 35, 40,
                    149, 148, 74, 11, 90, 31, 165, 160, 150, 124, 182, 58,
                ],
            ],
        },
        { id: 8, name: 'test-sanitizeParenthesesInExpression', server: '', anwser: '[a()a]', data: '(((a((()a' },
        { id: 9, name: 'test1-sanitizeParenthesesInExpression', server: '', anwser: '[(())(), ()()()]', data: '()())()' },
        { id: 10, name: 'test2-sanitizeParenthesesInExpression', server: '', anwser: '[(a())(), (a)()()]', data: '(a)())()' },
        { id: 11, name: 'test3-sanitizeParenthesesInExpression', server: '', anwser: '[""]', data: ')(' },
        { id: 12, name: 'test-arrayJumpingGame', server: '', anwser: 0, data: [0, 10, 0, 0, 0, 4, 7, 9, 7, 7, 1, 6, 5] },
        {
            id: 13,
            name: 'test-subarrayWithMaximumSum',
            server: '',
            anwser: 16,
            data: [6, 9, 1, -10, 1, -6, 9, -1, -3, -4, 1, 10, -4, -7, -7, 5, -5, -9],
        },
        { id: 14, name: 'test-minimumPathSumInATriangle', server: '', anwser: 11, data: [[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]] },
        {
            id: 15,
            name: 'test1-minimumPathSumInATriangle',
            server: '',
            anwser: 35,
            data: [
                [7],
                [3, 6],
                [6, 4, 2],
                [6, 1, 1, 9],
                [4, 8, 2, 8, 8],
                [2, 3, 4, 4, 6, 9],
                [1, 4, 2, 5, 4, 6, 3],
                [7, 9, 8, 4, 4, 7, 6, 2],
                [9, 1, 9, 6, 7, 2, 7, 6, 7],
                [6, 1, 5, 5, 2, 1, 4, 4, 5, 7],
                [4, 1, 7, 1, 9, 3, 6, 5, 3, 5, 5],
            ],
        },
        { id: 16, name: 'test-uniquePathsInAGridI', server: '', anwser: 220, data: [4, 10] },
    ],
    args: ['', ''],
    tprintf: (message, ...values) => {
        console.log('> ' + vsprintf(message, values));
    },
    tprint: (message) => console.log('> ' + message),
    codingcontract: {
        getData: (contract, server) => {
            let con = ns.contracts.find((element) => element.name === contract && element.server === server);
            return con.data;
        },
        attempt: (anwser, contract, server) => {
            console.log(anwser);
            let con = ns.contracts.find((element) => element.name === contract && element.server === server);
            return anwser === con.anwser ? 'Correct Anwser' : '';
        },
    },
};

if (process.argv.length > 2) {
    for (let i = 2; i < process.argv.length; i++) {
        let contract = ns.contracts[process.argv[i]];
        console.log('-------');
        ns.args[0] = contract.name;
        console.log(contract.name);
        functions[contract.name.split('-').pop()].main(ns);
    }
} else {
    for (let contract of ns.contracts) {
        console.log('-------');
        ns.args[0] = contract.name;
        console.log(contract.name);
        functions[contract.name.split('-').pop()].main(ns);
    }
}
