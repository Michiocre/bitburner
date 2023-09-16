import assert from 'assert';

import { solve as coloring } from './scripts/contracts/2coloring.js';
import { solve as algorithmicStockTraderI } from './scripts/contracts/algorithmicStockTraderI.js';
import { solve as algorithmicStockTraderII } from './scripts/contracts/algorithmicStockTraderII.js';
import { solve as algorithmicStockTraderIII } from './scripts/contracts/algorithmicStockTraderIII.js';
import { solve as algorithmicStockTraderIV } from './scripts/contracts/algorithmicStockTraderIV.js';
import { solve as arrayJumpingGame } from './scripts/contracts/arrayJumpingGame.js';
import { solve as arrayJumpingGameII } from './scripts/contracts/arrayJumpingGameII.js';
import { solve as compressionI } from './scripts/contracts/compressionI.js';
import { solve as compressionII } from './scripts/contracts/compressionII.js';
import { solve as compressionIII } from './scripts/contracts/compressionIII.js';
import { solve as encryptionI } from './scripts/contracts/encryptionI.js';
import { solve as encryptionII } from './scripts/contracts/encryptionII.js';
import { solve as findAllValidMathExpressions } from './scripts/contracts/findAllValidMathExpressions.js';
import { solve as findLargestPrimeFactor } from './scripts/contracts/findLargestPrimeFactor.js';
import { solve as generateIPAddresses } from './scripts/contracts/generateIPAddresses.js';
import { solve as hammingCodesToBinary } from './scripts/contracts/hammingCodesToBinary.js';
import { solve as hammingCodesToInteger } from './scripts/contracts/hammingCodesToInteger.js';
import { solve as mergeOverlappingIntervals } from './scripts/contracts/mergeOverlappingIntervals.js';
import { solve as minimumPathSumInATriangle } from './scripts/contracts/minimumPathSumInATriangle.js';
import { solve as sanitizeParenthesesInExpression } from './scripts/contracts/sanitizeParenthesesInExpression.js';
import { solve as shortestPathInAGrid } from './scripts/contracts/shortestPathInAGrid.js';
import { solve as spiralizeMatrix } from './scripts/contracts/spiralizeMatrix.js';
import { solve as subarrayWithMaximumSum } from './scripts/contracts/subarrayWithMaximumSum.js';
import { solve as totalWaysToSum } from './scripts/contracts/totalWaysToSum.js';
import { solve as totalWaysToSumII } from './scripts/contracts/totalWaysToSumII.js';
import { solve as uniquePathsInAGridI } from './scripts/contracts/uniquePathsInAGridI.js';
import { solve as uniquePathsInAGridII } from './scripts/contracts/uniquePathsInAGridII.js';

assert.deepEqual(algorithmicStockTraderI([65, 181, 43, 87, 63]), 116);

assert.deepEqual(algorithmicStockTraderII([126, 6, 43, 158, 4, 147, 41, 100, 100, 119, 143, 73, 7, 129, 46, 158, 6, 129, 160, 124, 126, 179, 41, 44, 68, 1, 88]), 954);
assert.deepEqual(algorithmicStockTraderII([154, 24, 55]), 31);
assert.deepEqual(algorithmicStockTraderII([154, 24, 55, 164, 82, 1, 135, 64, 147]), 357);
assert.deepEqual(algorithmicStockTraderII(
    [6, 122, 131, 130, 81, 77, 119, 196, 187, 5, 98, 44, 19, 188, 99, 75, 19, 128, 136, 134, 99, 113, 114, 36, 23, 25, 36, 49, 183, 26,
    124, 72, 30, 124, 114, 36, 64, 190, 52, 158, 18, 196, 174, 62, 130, 13,]
), 1496);

assert.deepEqual(algorithmicStockTraderIII(
    [133, 31, 25, 6, 82, 118, 68, 83, 95, 164, 123, 8, 139, 16, 37, 138, 168, 90, 21, 185, 10, 108, 93, 154, 1, 176, 80, 66, 195, 34, 68, 169, 49, 55,]
), 373);
assert.deepEqual(algorithmicStockTraderIII(
    [134, 163, 146, 149, 171, 167, 168, 162, 187, 66, 49, 78, 89, 8, 189, 30, 87, 70, 198, 68, 13, 167, 78, 188, 3, 144, 30, 142, 189, 92,
    6, 86, 68, 79,]
), 376);

assert.deepEqual(algorithmicStockTraderIV(
    [2, [23, 148, 145, 145, 107, 71, 24, 67, 95, 82, 162, 58, 145, 135, 184, 130, 175, 41, 184, 90, 43, 146, 15, 113, 97, 55, 102, 35, 40,
    149, 148, 74, 11, 90, 31, 165, 160, 150, 124, 182, 58,],]
), 332);

assert.deepEqual(sanitizeParenthesesInExpression('(((a((()a'), ['a()a', '(a)a']);
assert.deepEqual(sanitizeParenthesesInExpression('()())()'), ['(())()', '()()()']);
assert.deepEqual(sanitizeParenthesesInExpression('(a)())()'), ['(a())()', '(a)()()']);
assert.deepEqual(sanitizeParenthesesInExpression('(a)aa())()(())))'), ['(aaa(()(())))', '(aaa()((())))', '(aaa()()(()))', '(aaa())((()))', '(aaa())()(())', '(a)aa(((())))', '(a)aa(()(()))', '(a)aa()((()))', '(a)aa()()(())']);
assert.deepEqual(sanitizeParenthesesInExpression(')('), ['']);
assert.deepEqual(sanitizeParenthesesInExpression('())aa)))('), [ '(aa)', '()aa' ]);
assert.deepEqual(sanitizeParenthesesInExpression('))((a((a'), [ 'aa' ]);

assert.deepEqual(arrayJumpingGame([0, 10, 0, 0, 0, 4, 7, 9, 7, 7, 1, 6, 5]), 0);
assert.deepEqual(arrayJumpingGame([3,0,0,0,8,9,1,2,0,0,0]), 0);
assert.deepEqual(arrayJumpingGame([0,2,7,4,3,8,5,0,9,5,0,8,9,1,9,10,0,5,0,0,0]), 0);
assert.deepEqual(arrayJumpingGame([3,7,4,5,5,6,3,6,0,7,4,3,8,9,3,0,7]), 1);

assert.deepEqual(arrayJumpingGameII([0,1,2,3]), 0);
assert.deepEqual(arrayJumpingGameII([1,1,1,1]), 3);
assert.deepEqual(arrayJumpingGameII([2,1,2,1]), 2);
assert.deepEqual(arrayJumpingGameII([3,1,2,1]), 1);

assert.deepEqual(subarrayWithMaximumSum([6, 9, 1, -10, 1, -6, 9, -1, -3, -4, 1, 10, -4, -7, -7, 5, -5, -9]), 16);

assert.deepEqual(minimumPathSumInATriangle([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]), 11);
assert.deepEqual(minimumPathSumInATriangle([
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
]), 35);

assert.deepEqual(uniquePathsInAGridI([4, 10]), 220);

assert.deepEqual(spiralizeMatrix([
    [37, 35, 3],
    [8, 47, 29],
    [40, 42, 6],
    [50, 38, 37],
    [16, 10, 46],
    [47, 37, 8],
    [50, 43, 13],
    [24, 12, 13],
    [14, 48, 27],
    [46, 21, 21],
    [14, 38, 48],
    [41, 43, 46],
    [2, 2, 35],
    [5, 19, 49],
    [25, 6, 29],
]), [
    37, 35, 3, 29, 6, 37, 46, 8, 13, 13, 27, 21, 48, 46, 35, 49, 29, 6, 25, 5, 2, 41, 14, 46, 14, 24, 50, 47, 16, 50, 40, 8, 47, 42, 38,
    10, 37, 43, 12, 48, 21, 38, 43, 2, 19,
]);
assert.deepEqual(spiralizeMatrix([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]), [1, 2, 3, 6, 9, 8, 7, 4, 5
]);
assert.deepEqual(spiralizeMatrix([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
]), [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7
]);

assert.deepEqual(generateIPAddresses('320249249'), ['3.20.249.249', '3.202.49.249', '32.0.249.249']);
assert.deepEqual(generateIPAddresses('235886029'), ['235.88.60.29']);
assert.deepEqual(generateIPAddresses('1955229'), ['1.9.55.229', '1.95.5.229', '1.95.52.29', '19.5.5.229', '19.5.52.29', '19.55.2.29', '19.55.22.9', '195.5.2.29', '195.5.22.9', '195.52.2.9']);

assert.deepEqual(findAllValidMathExpressions(['123', 6]), ['1+2+3', '1*2*3']);
assert.deepEqual(findAllValidMathExpressions(['105', 5]), ['1*0+5', '10-5']);

assert.deepEqual(mergeOverlappingIntervals([[4,13],[5,12],[22,30]]), [[4, 13], [22, 30]]);
assert.deepEqual(mergeOverlappingIntervals([[2, 3], [4, 5]]), [[2, 3], [4, 5]]);
assert.deepEqual(mergeOverlappingIntervals([[4, 5], [2, 3]]), [[2, 3], [4, 5]]);
assert.deepEqual(mergeOverlappingIntervals([[2, 4], [4, 5]]), [[2, 5]]);
assert.deepEqual(mergeOverlappingIntervals([[2, 6], [4, 5]]), [[2, 6]]);
assert.deepEqual(mergeOverlappingIntervals([[4, 5], [2, 4]]), [[2, 5]]);
assert.deepEqual(mergeOverlappingIntervals([[4, 5], [2, 6]]), [[2, 6]]);
assert.deepEqual(mergeOverlappingIntervals([[4, 5], [4, 6]]), [[4, 6]]);
assert.deepEqual(mergeOverlappingIntervals([[4, 6], [4, 5]]), [[4, 6]]);
assert.deepEqual(mergeOverlappingIntervals([[4, 6], [5, 6]]), [[4, 6]]);
assert.deepEqual(mergeOverlappingIntervals([[5, 6], [4, 6]]), [[4, 6]]);
assert.deepEqual(mergeOverlappingIntervals([[4, 4], [4, 4]]), [[4, 4]]);
assert.deepEqual(mergeOverlappingIntervals([[14,16],[21,24],[20,22],[1,2],[22,26]]), [[1, 2], [14, 16], [20, 26]]);

assert.deepEqual(compressionI('aaaaabccc'), '5a1b3c');
assert.deepEqual(compressionI('aAaAaA'), '1a1A1a1A1a1A');
assert.deepEqual(compressionI('111112333'), '511233');
assert.deepEqual(compressionI('zzzzzzzzzzzzzzzzzzz'), '9z9z1z');
assert.deepEqual(compressionI('QQiiiiiuutffh88888888jj8OO0s222222jjjjjjjjjjjjjjMMMMMMMMMFF00000000ojjxTnnnn'), '2Q5i2u1t2f1h882j182O101s629j5j9M2F801o2j1x1T4n');

assert.deepEqual(compressionII('5aaabb450723abb'), 'aaabbaaababababaabb');

assert.deepEqual(compressionIII('abracadabra'), '7abracad47');

assert.deepEqual(encryptionI(['CACHE MACRO ARRAY QUEUE SHELL', 7]), 'VTVAX FTVKH TKKTR JNXNX LAXEE');

assert.deepEqual(encryptionII(['ENTEREMAILMODEMTRASHSHIFT', 'SOFTWARE']), 'WBYXNEDEAZRHZEDXJOXAOHZJL');

assert.deepEqual(coloring([4, [[0, 2], [0, 3], [1, 2], [1, 3]]]), [0, 0, 1, 1]);
assert.deepEqual(coloring([3, [[0, 1], [0, 2], [1, 2]]]), []);

assert.deepEqual(hammingCodesToBinary(21), '1001101011');
assert.deepEqual(hammingCodesToBinary(8), '11110000');

assert.deepEqual(hammingCodesToInteger('11110000'), 8);
assert.deepEqual(hammingCodesToInteger('01110000'), 8);
assert.deepEqual(hammingCodesToInteger('10110000'), 8);
assert.deepEqual(hammingCodesToInteger('11010000'), 8);
assert.deepEqual(hammingCodesToInteger('11100000'), 8);
assert.deepEqual(hammingCodesToInteger('11111000'), 8);
assert.deepEqual(hammingCodesToInteger('11110100'), 8);

assert.deepEqual(totalWaysToSumII([4, [1, 2]]), 3);
assert.deepEqual(totalWaysToSumII([4, [1, 2, 3]]), 4);
assert.deepEqual(totalWaysToSumII([3, [1, 2, 3]]), 3);
assert.deepEqual(totalWaysToSumII([178, [1,2,5,6,9,10,11,13,17]]), 8270669);

assert.deepEqual(shortestPathInAGrid([[0,1,0,0,0],[0,0,0,1,0]]), 'DRRURRD');
assert.deepEqual(shortestPathInAGrid([[0,1],[1,0]]), '');