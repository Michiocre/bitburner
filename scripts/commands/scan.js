import { numberSquish } from './lib/functions.js';
import { ServerTree} from './lib/serverTree.js';


/** @type {import("../../NetscriptDefinitions").NS} ns */
let ns;

export async function getServerArray() {
    let root = await getChildren('home', '');
    return root.toStringArray();
}

export async function getServerTree() {
    return await getChildren('home', '');
}

async function getChildren(currentName, parentPath) {
    let children = await ns.scan(currentName);
    let path = parentPath + ' > ' + currentName;

    let server = new ServerTree(currentName, [], path);

    for (let child of children) {
        if (parentPath.split(' ').pop() === child) {
            continue;
        }
        server.children.push(await getChildren(child, path));
    }

    return server;
}

/** @param {import("../../NetscriptDefinitions").AutocompleteData} data */
export function autocomplete(data, args) {
    return ['tree', 'name', 'skill', 'money', 'maxMoney', 'ram', 'maxRam', 'security', 'special', 'filter']
}

export async function main(_ns) {
    ns = _ns;
    if (ns.args[0] == 'help') {
        ns.tprint('Usage: scan [tree|name|skill|money|maxMoney|ram|maxRam|security|special|filter|]')
        return;
    }

    let serverRoot = await getServerTree();

    if (!ns.args[0] || ns.args[0] === 'tree') {
        let maxIndent = serverRoot.maxDepth() + serverRoot.longestName();
        ns.tprint(maxIndent);
        ns.tprint(generateHeader(maxIndent));
        printTree(serverRoot, 0, maxIndent);
    } else {
        let nameIndent = serverRoot.longestName();
        let serverList = serverRoot.toArray();

        switch (ns.args[0]) {
            case 'name':
                serverList.sort((a, b) => a.name < b.name ? -1 : 1 );
                break;
            case 'skill':
                serverList.sort((a, b) => ns.getServerRequiredHackingLevel(a.name) - ns.getServerRequiredHackingLevel(b.name));
                break;
            case 'money':
                serverList.sort((a, b) => ns.getServerMoneyAvailable(a.name) - ns.getServerMoneyAvailable(b.name));
                break;
            case 'maxMoney':
                serverList.sort((a, b) => ns.getServerMaxMoney(a.name) - ns.getServerMaxMoney(b.name));
                break;
            case 'ram':
                serverList.sort((a, b) => ns.getServerMaxRam(a.name) - ns.getServerMaxRam(b.name));
                break;
            case 'maxRam':
                serverList.sort((a, b) => {
                    let freeRamA = ns.getServerMaxRam(a.name) - ns.getServerNumPortsRequired(a.name);
                    let freeRamB = ns.getServerMaxRam(b.name) - ns.getServerNumPortsRequired(b.name);
                    return freeRamA - freeRamB;
                });
                break;
            case 'security':
                serverList.sort((a, b) => {
                    let secA = ns.getServerSecurityLevel(a.name) - ns.getServerMinSecurityLevel(a.name);
                    let secB = ns.getServerSecurityLevel(b.name) - ns.getServerMinSecurityLevel(b.name);
                    return secA - secB;
                });
                break;
            case 'special':
                serverList = serverList.filter((s) => ns.getServerMaxMoney(s.name) === 0 && !s.name.includes('blank') && !s.isHome());
                break;
            case 'filter':
                if (ns.args.length < 2) {
                    ns.tprint('Missing arguments, just add multiple names.');
                }
                let searchTargets = ns.args.slice(1);
                serverList = serverList
                    .filter((s) => searchTargets.includes(s.name))
                    .sort((a, b) => ns.getServerMaxMoney(a.name) - ns.getServerMaxMoney(b.name));
                break;
            case 'search':
                if (ns.args.length < 2) {
                    ns.tprint('Missing argument (search works by name).');
                }
                serverList = serverList.filter((s) => s.name.includes(ns.args[1]));
                break;
            default:
                ns.tprint('Unknown argument.');
                return;
        }

        ns.tprint(generateHeader(nameIndent));
        for (let server of serverList) {
            ns.tprint(stringifyServer(server, 0, nameIndent));
        }
        switch (ns.args[0]) {
            case 'filter':
                ns.tprintf('Total targets: %i', serverList.length);
                break;
            default:
                break;
        }
    }
}

function printTree(root, depth, maxIndent) {
    ns.tprint(stringifyServer(root, depth, maxIndent));
    for (const child of root.children) {
        printTree(child, depth + 1, maxIndent);
    }
}

let spacing = [6, 13, 13, 11, 11, 8];

/**
 * @param {Number} nameSpacing
 */
function generateHeader(nameSpacing) {
    let serverName = 'Server'.padEnd(nameSpacing);
    let hackingSkill = 'Skill'.padStart(spacing[0]);
    let moneyCurrent = 'Current Money'.padStart(spacing[1]);
    let moneyMax = 'Max Money'.padStart(spacing[2]);
    let ram = 'Current Ram'.padStart(spacing[3]);
    let ramMax = 'Max RAM'.padStart(spacing[4]);
    let security = 'Security'.padStart(spacing[5]);
    return ns.sprintf('| %s |%s | %s | %s | %s | %s | %s |', serverName, hackingSkill, moneyCurrent, moneyMax, ram, ramMax, security);
}

/**
 * @param {ServerTree} server
 * @param {Number} indent
 * @param {Number} nameSpacing
 */
function stringifyServer(server, indent, nameSpacing) {
    let serverName = (' '.repeat(indent) + server.name).padEnd(nameSpacing);
    let hackingSkill = ns.getServerRequiredHackingLevel(server.name).toLocaleString().padStart(spacing[0]);
    let moneyCurrent = numberSquish(ns.getServerMoneyAvailable(server.name)).padStart(spacing[1]);
    let moneyMax = numberSquish(ns.getServerMaxMoney(server.name)).padStart(spacing[2]);
    let ram = numberSquish(ns.getServerMaxRam(server.name) - ns.getServerUsedRam(server.name), true).padStart(spacing[3]);
    let ramMax = numberSquish(ns.getServerMaxRam(server.name), true).padStart(spacing[4]);
    let security = numberSquish(ns.getServerSecurityLevel(server.name) - ns.getServerMinSecurityLevel(server.name)).padStart(spacing[5]);
    return ns.sprintf('> %s |%s | %s | %s | %s | %s | %s |', serverName, hackingSkill, moneyCurrent, moneyMax, ram, ramMax, security);
}
