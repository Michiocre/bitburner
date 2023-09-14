import { NS } from '@ns'
export async function main(ns : NS) : Promise<void> {
    const target = ns.args[0];
    const paths: { [key: string]: string; } = { home: '' };
    const queue = Object.keys(paths);
    let name;
    let output : string;
    let pathToTarget: string[] = [];
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
    output = 'home; ';

    pathToTarget.forEach((server) => (output += ' connect ' + server + ';'));

    const terminalInput = (document.getElementById('terminal-input') as HTMLInputElement);
    if (terminalInput != null) {
        terminalInput.value = output;
        const handler = Object.keys(terminalInput)[1];
        console.log(handler);
        terminalInput[handler].onChange({ target: terminalInput });
        terminalInput[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function autocomplete(data : AutocompleteData, args : string[]) : string[] {
    return [...data.servers]
}