import { getServerArray } from './lib/functions.js';

import { solve as coloring } from './contracts/2coloring.js';
import { solve as algorithmicStockTraderI } from './contracts/algorithmicStockTraderI.js';
import { solve as algorithmicStockTraderII } from './contracts/algorithmicStockTraderII.js';
import { solve as algorithmicStockTraderIII } from './contracts/algorithmicStockTraderIII.js';
import { solve as algorithmicStockTraderIV } from './contracts/algorithmicStockTraderIV.js';
import { solve as arrayJumpingGame } from './contracts/arrayJumpingGame.js';
import { solve as arrayJumpingGameII } from './contracts/arrayJumpingGameII.js';
import { solve as compressionI } from './contracts/compressionI.js';
import { solve as compressionII } from './contracts/compressionII.js';
import { solve as compressionIII } from './contracts/compressionIII.js';
import { solve as encryptionI } from './contracts/encryptionI.js';
import { solve as encryptionII } from './contracts/encryptionII.js';
import { solve as findAllValidMathExpressions } from './contracts/findAllValidMathExpressions.js';
import { solve as findLargestPrimeFactor } from './contracts/findLargestPrimeFactor.js';
import { solve as generateIPAddresses } from './contracts/generateIPAddresses.js';
import { solve as hammingCodesToBinary } from './contracts/hammingCodesToBinary.js';
import { solve as hammingCodesToInteger } from './contracts/hammingCodesToInteger.js';
import { solve as mergeOverlappingIntervals } from './contracts/mergeOverlappingIntervals.js';
import { solve as minimumPathSumInATriangle } from './contracts/minimumPathSumInATriangle.js';
import { solve as sanitizeParenthesesInExpression } from './contracts/sanitizeParenthesesInExpression.js';
import { solve as shortestPathInAGrid } from './contracts/shortestPathInAGrid.js';
import { solve as spiralizeMatrix } from './contracts/spiralizeMatrix.js';
import { solve as subarrayWithMaximumSum } from './contracts/subarrayWithMaximumSum.js';
import { solve as totalWaysToSum } from './contracts/totalWaysToSum.js';
import { solve as totalWaysToSumII } from './contracts/totalWaysToSumII.js';
import { solve as uniquePathsInAGridI } from './contracts/uniquePathsInAGridI.js';
import { solve as uniquePathsInAGridII } from './contracts/uniquePathsInAGridII.js';

let contractIndex = {
    'Proper 2-Coloring of a Graph' : coloring,
    'Algorithmic Stock Trader I' : algorithmicStockTraderI,
    'Algorithmic Stock Trader II' : algorithmicStockTraderII,
    'Algorithmic Stock Trader III' : algorithmicStockTraderIII,
    'Algorithmic Stock Trader IV' : algorithmicStockTraderIV,
    'Array Jumping Game' : arrayJumpingGame,
    'Array Jumping Game II' : arrayJumpingGameII,
    'Compression I: RLE Compression' : compressionI,
    'Compression II: LZ Decompression' : compressionII,
    'Compression III: LZ Compression' : compressionIII,
    'Encryption I: Caesar Cipher' : encryptionI,
    'Encryption II: Vigenère Cipher' : encryptionII,
    'Find All Valid Math Expressions' : findAllValidMathExpressions,
    'Find Largest Prime Factor' : findLargestPrimeFactor,
    'Generate IP Addresses' : generateIPAddresses,
    'HammingCodes: Integer to Encoded Binary' : hammingCodesToBinary,
    'HammingCodes: Encoded Binary to Integer' : hammingCodesToInteger,
    'Merge Overlapping Intervals' : mergeOverlappingIntervals,
    'Minimum Path Sum in a Triangle' : minimumPathSumInATriangle,
    'Sanitize Parentheses in Expression' : sanitizeParenthesesInExpression,
    'Shortest Path in a Grid' : shortestPathInAGrid,
    'Spiralize Matrix' : spiralizeMatrix,
    'Subarray with Maximum Sum' : subarrayWithMaximumSum,
    'Total Ways to Sum' : totalWaysToSum,
    'Total Ways to Sum II' : totalWaysToSumII,
    'Unique Paths in a Grid I' : uniquePathsInAGridI,
    'Unique Paths in a Grid II' : uniquePathsInAGridII
}

/** @param {import("../../NetscriptDefinitions.js").NS} ns */
export async function main(ns) {
    let servers = getServerArray(ns);

    while (true) {
        let contracts = [];
        for (let server of servers) {
            for (let file of ns.ls(server, '.cct')) {
                contracts.push({ file: file, server: server });
                break;
            }
            if (contracts.length > 0) {
                break;
            }
        }

        if (contracts.length == 0) {
            await ns.sleep(10000);
            continue;
        }

        let contract = contracts.shift();
        let contractType = ns.codingcontract.getContractType(contract.file, contract.server);
        let data = ns.codingcontract.getData(contract.file, contract.server);

        let algorithm = contractIndex[contractType];

        if (!algorithm) {
            ns.printf('No algorithm found for type: %s', contractType);
            continue;
        }

        ns.printf('Attempting `%s`\nData: %j', contractType, data);
        let anwser = contractIndex[contractType](data);

        let response = ns.codingcontract.attempt(anwser, contract.file, contract.server, { returnReward: true });

        if (response) {
            ns.print(response);
        } else {
            ns.printf('ERROR: Failed with Anwser: %j', anwser);
        }

        await ns.sleep(1000);
    }
}