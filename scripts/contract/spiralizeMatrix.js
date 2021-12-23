/*
Given the following array of arrays of numbers representing a 2D matrix, return the elements of the matrix as an array in spiral order:

[
	[37,35, 3]
	[ 8,47,29]
	[40,42, 6]
	[50,38,37]
	[16,10,46]
	[47,37, 8]
	[50,43,13]
	[24,12,13]
	[14,48,27]
	[46,21,21]
	[14,38,48]
	[41,43,46]
	[ 2, 2,35]
	[ 5,19,49]
	[25, 6,29]
]

Here is an example of what spiral order should be:

[
	[1, 2, 3]
	[4, 5, 6]
	[7, 8, 9]
]

Answer: [1, 2, 3, 6, 9, 8 ,7, 4, 5]

Note that the matrix will not always be square:

[
	[1,2,3,4]
	[5,6,7,8]
	[9,10,11,12]
]

Answer: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
*/

/** @param {import("../.").NS} ns */
export async function main(ns) {
    let contract = ns.args[0];
    let server = ns.args[1];

    let data = ns.codingcontract.getData(contract, server);
    let anwser = solve(data);
    //let response = data;
    let response = ns.codingcontract.attempt(anwser, contract, server, { returnReward: true });

    if (response) {
        ns.tprint(response);
    } else {
        ns.tprint('FAILED ATTEMPT');
        ns.tprintf('Data %j', data);
        ns.tprintf('Anwser %j', anwser);
    }
}

/**
 * @param {import("../.").NS} ns
 */
function solve(data) {
    let direction = 0; // 0 > ; 1 v ; 2 < ; 3 ^
    let x = 0;
    let y = 0;

    let solution = [];

    while (true) {
        //console.log(data[y][x]);
        let r = x + 1 < data[0].length && data[y][x + 1] != 'x';
        let l = x - 1 >= 0 && data[y][x - 1] != 'x';
        let u = y - 1 >= 0 && data[y - 1][x] != 'x';
        let d = y + 1 < data.length && data[y + 1][x] != 'x';

        if (!r && !l && !u && !d) {
            solution.push(data[y][x]);
            break;
        }

        switch (direction) {
            case 0:
                if (!r) {
                    direction = (direction + 1) % 4;
                }
                break;
            case 1:
                if (!d) {
                    direction = (direction + 1) % 4;
                }
                break;
            case 2:
                if (!l) {
                    direction = (direction + 1) % 4;
                }
                break;
            case 3:
                if (!u) {
                    direction = (direction + 1) % 4;
                }
                break;
        }

        solution.push(data[y][x]);
        data[y][x] = 'x';

        switch (direction) {
            case 0:
                x++;
                break;
            case 1:
                y++;
                break;
            case 2:
                x--;
                break;
            case 3:
                y--;
                break;
            default:
                break;
        }
    }

    return solution;
}
