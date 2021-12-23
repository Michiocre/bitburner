/*
You are given the following array of stock prices (which are numbers) 
where the i-th element represents the stock price on day i:

133,31,25,6,82,118,68,83,95,164,123,8,139,16,37,138,168,90,21,185,10,108,93,154,1,176,80,66,195,34,68,169,49,55

Determine the maximum possible profit you can earn using at most two transactions. 
A transaction is defined as buying and then selling one share of the stock. 
Note that you cannot engage in multiple transactions at once. 
In other words, you must sell the stock before you buy it again.

If no profit can be made, then the answer should be 0
*/

/** @param {import("../.").NS} ns */
export async function main(ns) {
    let contract = ns.args[0];
    let server = ns.args[1];

    let data = ns.codingcontract.getData(contract, server);
    let iterations = 2;
    let anwser = solve(iterations, data);

    if (anwser < 0) {
        anwser = 0;
    }

    //let response = anwser;
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
 * @param {Number[]} prices
 * */
function solve(iterations, prices) {
    let highestProfits = [];
    for (let i = 0; i < iterations; i++) {
        highestProfits.push(new Array(prices.length).fill(0));
    }

    for (let i = 0; i < iterations; i++) {
        for (let j = 0; j < prices.length; j++) {
            for (let k = j; k < prices.length; k++) {
                if (i > 0 && j > 0 && k > 0) {
                    highestProfits[i][k] = Math.max(
                        highestProfits[i][k],
                        highestProfits[i - 1][k],
                        highestProfits[i][k - 1],
                        highestProfits[i - 1][j - 1] + prices[k] - prices[j]
                    );
                } else if (i > 0 && j > 0) {
                    highestProfits[i][k] = Math.max(
                        highestProfits[i][k],
                        highestProfits[i - 1][k],
                        highestProfits[i - 1][j - 1] + prices[k] - prices[j]
                    );
                } else if (i > 0 && k > 0) {
                    highestProfits[i][k] = Math.max(highestProfits[i][k], highestProfits[i - 1][k], highestProfits[i][k - 1], prices[k] - prices[j]);
                } else if (j > 0 && k > 0) {
                    highestProfits[i][k] = Math.max(highestProfits[i][k], highestProfits[i][k - 1], prices[k] - prices[j]);
                } else {
                    highestProfits[i][k] = Math.max(highestProfits[i][k], prices[k] - prices[j]);
                }
            }
        }
    }
    return highestProfits[iterations - 1][prices.length - 1];
}
