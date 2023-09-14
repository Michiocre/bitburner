/** To use create an alias
 * alias con="home;commands/connect.js"
 * now you can use con SERVERNAME to connect to everything
 */
/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const target = ns.args[0];
    const paths = { home: '' };
    const queue = Object.keys(paths);
    let name;
    let output = '';
    let pathToTarget = [];
    while ((name = queue.shift())) {
        const path = paths[name];
        const scanRes = ns.scan(name);
        for (const newSv of scanRes) {
            if (paths[newSv] === undefined) {
                queue.push(newSv);
                paths[newSv] = `${path},${newSv}`;
                if (newSv == target) pathToTarget = paths[newSv].substr(1).split(',');
            }
        }
    }

    pathToTarget.forEach((server) => (output += ' connect ' + server + ';'));

    const terminalInput = document.getElementById('terminal-input');
    if (terminalInput != null) {
        // Set the value to the command you want to run.
        terminalInput.value=output;

        // Get a reference to the React event handler.
        const handler = Object.keys(terminalInput)[1];

        // Perform an onChange event to set some internal values.
        terminalInput[handler].onChange({target:terminalInput});

        // Simulate an enter press
        terminalInput[handler].onKeyDown({key:'Enter',preventDefault:()=>null});
    }
}

/** @param {import("../../NetscriptDefinitions").AutocompleteData} data */
export function autocomplete(data, args) {
    return [...data.servers]
}