/*
Caesar cipher is one of the simplest encryption technique. 
It is a type of substitution cipher in which each letter in the plaintext  is replaced 
by a letter some fixed number of positions down the alphabet. 
For example, with a left shift of 3, D would be replaced by A,  E would become B, 
and A would become X (because of rotation).

 You are given an array with two elements:
   ["CACHE MACRO ARRAY QUEUE SHELL", 7]
 The first element is the plaintext, the second element is the left shift value.

 Return the ciphertext as uppercase string. Spaces remains the same.
*/

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let contract = ns.args[0];
    let server = ns.args[1];

    let data = ns.codingcontract.getData(contract, server);
    let anwser = solve(data);

    let response = ns.codingcontract.attempt(anwser, contract, server, { returnReward: true });

    if (response) {
        ns.tprint(response);
    } else {
        ns.tprint('FAILED ATTEMPT');
        ns.tprintf('Data: %s', data);
        ns.tprintf('My Anwser: %s', anwser);
    }
}

/**
 * @param {String} data
 * @returns {String}
 */
export function solve(data) {
    let plaintext = data[0];
    let offset = data[1];

    let ciphertext = '';
    for (let i = 0; i < plaintext.length; i++) {
        let val = plaintext.charCodeAt(i) - 65;
        if (val >= 0 && val < 26) {
            val -= offset;
            val = ((val % 26) + 26) % 26;
            val += 65;
            ciphertext += String.fromCharCode(val);   
        } else {
            ciphertext += plaintext[i];
        }
    }
    
    return ciphertext;
}