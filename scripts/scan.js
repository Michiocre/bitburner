import { ServerTree, numberSquish } from './lib.js';

/**
 * Async
 * @param {import(".").NS} ns
 */
export async function getServerArray(ns) {
    let root = await getChildren(ns, 'home', '');
    return root.toStringArray();
}

/**
 * Async
 * @param {import(".").NS} ns
 */
export async function getServerTree(ns) {
    return await getChildren(ns, 'home', '');
}

/**
 * @param {import(".").NS} ns
 * @param {string} currentName
 * @param {string} parentPath
 */
async function getChildren(ns, currentName, parentPath) {
    let children = await ns.scan(currentName);
    let path = parentPath + ' > ' + currentName;

    let server = new ServerTree(currentName, [], path);

    for (let child of children) {
        if (parentPath.split(' ').pop() === child) {
            continue;
        }
        server.children.push(await getChildren(ns, child, path));
    }

    return server;
}

/** @param {import(".").NS} ns */
export async function main(ns) {
    let serverRoot = await getServerTree(ns);

    if (!ns.args[0] || ns.args[0] === 'tree') {
        let maxIndent = serverRoot.maxDepth() + serverRoot.longestName();
        ns.tprint(maxIndent);
        ns.tprint(generateHeader(ns, maxIndent));
        printTree(ns, serverRoot, 0, maxIndent);
    } else {
        let nameIndent = serverRoot.longestName();
        let serverList = serverRoot.toArray();

        switch (ns.args[0]) {
            case 'name':
                serverList.sort((a, b) => a.name - b.name);
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
                    ns.tprint('Missing argument.');
                }
                let searchTargets = ns.args.slice(1);
                serverList = serverList
                    .filter((s) => searchTargets.includes(s.name))
                    .sort((a, b) => ns.getServerMaxMoney(a.name) - ns.getServerMaxMoney(b.name));
                break;
            case 'search':
                if (ns.args.length < 2) {
                    ns.tprint('Missing argument.');
                }
                serverList = serverList.filter((s) => s.name.includes(ns.args[1]));
                break;
            default:
                ns.tprint('Unknown argument.');
                return;
        }

        ns.tprint(generateHeader(ns, nameIndent));
        for (let server of serverList) {
            ns.tprint(stringifyServer(ns, server, 0, nameIndent));
        }
        switch (ns.args[0]) {
            case 'special':
            case 'search':
                if (ns.args[0] === 'special' || ns.args[0] === 'search') {
                    for (let server of serverList) {
                        ns.tprintf('Path to %s: %s', server.name.padEnd(13), server.path);
                    }
                }
                break;
            case 'filter':
                ns.tprintf('Total targets: %i', serverList.length);
                break;
            default:
                break;
        }
    }
}

/** @param {import(".").NS} ns */
function printTree(ns, root, depth, maxIndent) {
    ns.tprint(stringifyServer(ns, root, depth, maxIndent));
    for (const child of root.children) {
        printTree(ns, child, depth + 1, maxIndent);
    }
}

let spacing = [6, 13, 13, 11, 11, 8];

/**
 * @param {import(".").NS} ns
 * @param {Number} spacingMod
 */
function generateHeader(ns, nameSpacing) {
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
 * @param {import(".").NS} ns
 * @param {ServerTree} server
 * @param {Number} indent
 * @param {Number} nameSpacing
 */
function stringifyServer(ns, server, indent, nameSpacing) {
    let serverName = (' '.repeat(indent) + server.name).padEnd(nameSpacing);
    let hackingSkill = ns.getServerRequiredHackingLevel(server.name).toLocaleString().padStart(spacing[0]);
    let moneyCurrent = numberSquish(ns.getServerMoneyAvailable(server.name)).padStart(spacing[1]);
    let moneyMax = numberSquish(ns.getServerMaxMoney(server.name)).padStart(spacing[2]);
    let ram = numberSquish(ns.getServerMaxRam(server.name) - ns.getServerUsedRam(server.name), true).padStart(spacing[3]);
    let ramMax = numberSquish(ns.getServerMaxRam(server.name), true).padStart(spacing[4]);
    let security = numberSquish(ns.getServerSecurityLevel(server.name) - ns.getServerMinSecurityLevel(server.name)).padStart(spacing[5]);
    return ns.sprintf('> %s |%s | %s | %s | %s | %s | %s |', serverName, hackingSkill, moneyCurrent, moneyMax, ram, ramMax, security);
}
