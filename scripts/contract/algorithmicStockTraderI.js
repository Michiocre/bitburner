/*
You are given the following array of stock prices (which are numbers) where the i-th element represents the stock price on day i:

65,181,43,87,63

Determine the maximum possible profit you can earn using at most one
transaction (i.e. you can only buy and sell the stock once). 
If no profit can be made then the answer should be 0. 
Note that you have to buy the stock before you can sell it
*/

/** @param {import("../.").NS} ns */
export async function main(ns) {
    let contract = ns.args[0];
    let server = ns.args[1];

    let data = ns.codingcontract.getData(contract, server);
    let anwser = solve(data, ns);

    if (anwser < 0) {
        anwser = 0;
    }

    //let response = anwser;
    let response = ns.codingcontract.attempt(anwser, contract, server, {returnReward: true});

    if (response) {
        ns.tprint(response);
    } else {
        ns.tprint('FAILED ATTEMPT');
        ns.tprintf('Data %j', data);
        ns.tprintf('Anwser %i', anwser);
    }
}

/**
 * @param {import("../.").NS}
 * @param {Number[]} prices
*/ 
function solve(prices, ns) {
    let profit = 0;
    for (let i = 0; i < prices.length - 1; i++) {
        for (let j = i + 1; j < prices.length; j++) {
            if (prices[j] - prices[i] > profit) {
                profit = prices[j] - prices[i];
            }
        }
    }
    return profit;
}