/*
Vigenère cipher is a type of polyalphabetic substitution. It uses  the Vigenère square to encrypt and decrypt plaintext with a keyword.

   Vigenère square:
          A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 
        +----------------------------------------------------
      A | A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 
      B | B C D E F G H I J K L M N O P Q R S T U V W X Y Z A 
      C | C D E F G H I J K L M N O P Q R S T U V W X Y Z A B
      D | D E F G H I J K L M N O P Q R S T U V W X Y Z A B C
      E | E F G H I J K L M N O P Q R S T U V W X Y Z A B C D
      ...
      Y | Y Z A B C D E F G H I J K L M N O P Q R S T U V W X
      Z | Z A B C D E F G H I J K L M N O P Q R S T U V W X Y

 For encryption each letter of the plaintext is paired with the corresponding letter of a repeating keyword. For example, the plaintext DASHBOARD is encrypted with the keyword LINUX:
    Plaintext: DASHBOARD
    Keyword:   LINUXLINU
 So, the first letter D is paired with the first letter of the key L. Therefore, row D and column L of the  Vigenère square are used to get the first cipher letter O. This must be repeated for the whole ciphertext.

 You are given an array with two elements:
   ["ENTEREMAILMODEMTRASHSHIFT", "SOFTWARE"]
 The first element is the plaintext, the second element is the keyword.

 Return the ciphertext as uppercase string.
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
    let keyword = data[1];

    let ciphertext = '';
    for (let i = 0; i < plaintext.length; i++) {
        let pVal = plaintext.charCodeAt(i) - 65;
        let kVal = keyword.charCodeAt(i % keyword.length) - 65;

        let sum = pVal + kVal;
        let cVal = sum % 26;

        ciphertext += String.fromCharCode(cVal + 65);
    }
    
    return ciphertext;
}