/** @param {import("../.").NS} ns */
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
        ns.tprintf('Data %i', data);
        ns.tprintf('Anwser %s', anwser);
    }
}

/** @param {import("../.").NS} ns */
function solve(data, ns) {
    let dataString = data.toString();
    let valids = [];
    for (let i = 1; i < 4; i++) {
        let first = dataString.substring(0, i);
        if (first[0] == '0' || Number.parseInt(first) > 255) {
            break;
        }
        for (let j = i+1; j < i+4; j++) {
            let second = dataString.substring(i, j);
            if (second[0] == '0' || Number.parseInt(second) > 255) {
                break;
            }
            for (let k = j+1; k < j+4; k++) {
                let third = dataString.substring(j, k);
                if (third[0] == '0' || Number.parseInt(third) > 255) {
                    break;
                }
                for (let l = k+1; l < k+4; l++) {
                    let fourth = dataString.substring(k, l);
                    if (fourth[0] == '0' || Number.parseInt(fourth) > 255) {
                        break;
                    }

                    let testString = [first, second, third, fourth].join('');
                    let validString = [first, second, third, fourth].join('.');

                    if (testString == dataString && !valids.includes(validString)) {
                        valids.push(validString);
                    }
                }
            }
        }
    }
    return valids;
}