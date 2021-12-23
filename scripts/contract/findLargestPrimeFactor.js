/*
A prime factor is a factor that is a prime number. What is the largest prime factor of 847089252?
*/

/** @param {import("../.").NS} ns */
export async function main(ns) {
    let contract = ns.args[0];
    let server = ns.args[1];

    let data = ns.codingcontract.getData(contract, server);
    let anwser = solve(data, ns);

    //let response = anwser;
    let response = ns.codingcontract.attempt(anwser, contract, server, {returnReward: true});

    if (response) {
        ns.tprint(response);
    } else {
        ns.tprint('FAILED ATTEMPT');
        ns.tprintf('Data %i', data);
        ns.tprintf('Anwser %i', anwser);
    }
}

/**
 * @param {import("../.").NS} ns
 * @param {Number} n
*/ 
function solve(n, ns) {
    let maxPrime = -1;

    while (n % 2 == 0) {
        maxPrime = 2;
        n /= 2;
    }

    while (n % 3 == 0) {
        maxPrime = 3;
        n /= 3;
    }

    for (let i = 5; i <= Math.sqrt(n); i += 6) {
        while (n % i == 0) {
            maxPrime = i;
            n /= i;
        }
      while (n % (i+2) == 0) {
            maxPrime = i+2;
            n /= (i+2);
        }
    }
 
    // This condition is to handle the case
    // when n is a prime number greater than 4
    if (n > 4)
        maxPrime = n;
 
    return maxPrime;
}