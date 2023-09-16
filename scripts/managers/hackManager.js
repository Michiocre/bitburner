import { getServerArray } from './lib/functions.js';

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    ns.disableLog('ALL');

    let scriptName = 'basics/smartHack.js';
    let monitorScriptName = 'basics/hackMonitor.js';
    let scriptRam = ns.getScriptRam(scriptName);
    let homeRamSpace = 1024;

    let hostName = ns.getHostname();

    let portLevel = 0;
    if (ns.fileExists('brutessh.exe')) portLevel = 1;
    if (ns.fileExists('ftpcrack.exe')) portLevel = 2;
    if (ns.fileExists('relaysmtp.exe')) portLevel = 3;
    if (ns.fileExists('httpworm.exe')) portLevel = 4;
    if (ns.fileExists('sqlinject.exe')) portLevel = 5;

    let allServers = getServerArray(ns);

    let targets = [];
    let totalTargetMaxMoney = 0;
    for (let server of allServers) {
        if (ns.getServerMaxMoney(server) > 0) {
            if (ns.getServerNumPortsRequired(server) <= portLevel) {
                if (ns.getServerRequiredHackingLevel(server) <= Math.ceil(ns.getHackingLevel() * 0.9)) {
                    totalTargetMaxMoney += ns.getServerMaxMoney(server);
                    targets.push({ name: server, moneyP: 0, threads: 0 });
                }
            }
        }
    }

    for (let target of targets) {
        target.moneyP = ns.getServerMaxMoney(target.name) / totalTargetMaxMoney;
    }

    for (let server of allServers) {
        if (server == hostName) {
            continue;
        }
        if (!ns.hasRootAccess(server)) {
            switch (ns.getServerNumPortsRequired(server)) {
                case 5:
                    if (portLevel < 5) continue;
                    ns.sqlinject(server);
                case 4:
                    if (portLevel < 4) continue;
                    ns.httpworm(server);
                case 3:
                    if (portLevel < 3) continue;
                    ns.relaysmtp(server);
                case 2:
                    if (portLevel < 2) continue;
                    ns.ftpcrack(server);
                case 1:
                    if (portLevel < 1) continue;
                    ns.brutessh(server);
                case 0:
                    ns.nuke(server);
                    break;
                default:
                    continue;
            }
        }
        

        ns.scriptKill(scriptName, server);
        ns.rm(scriptName, server);
        ns.scp(scriptName, server);
        let freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
        let maxThreads = Math.floor(freeRam / scriptRam);

        let threadCount = 0;
        for (let i = 0; i < targets.length - 1; i++) {
            let targetThreads = Math.floor(maxThreads * targets[i].moneyP);
            if (targetThreads > 0) {
                execute(ns, scriptName, server, targets[i], targetThreads);
            }
            targets[i].threads += targetThreads;
            threadCount += targetThreads;
        }
        if (threadCount < maxThreads) {
            let targetThreads = maxThreads - threadCount;
            if (targetThreads > 0) {
                execute(ns, scriptName, server, targets[targets.length - 1], targetThreads);
            }
            targets[targets.length - 1].threads += targetThreads;
            threadCount += targetThreads;
        }

        if (threadCount < maxThreads) {
            ns.tprintf(`Remaining threads on ${server}`);
        }
    }

    ns.scriptKill(monitorScriptName, hostName);
    for (let target of targets) {
        ns.exec(monitorScriptName, hostName, 1, target.name);
    }

    ns.scriptKill(scriptName, hostName);
    let ram = ns.getServerMaxRam(hostName) - homeRamSpace;
    let maxThreads = Math.floor(ram / scriptRam);

    let threadCount = 0;
    for (let i = 0; i < targets.length - 1; i++) {
        let targetThreads = Math.floor(maxThreads * targets[i].moneyP);
        if (targetThreads > 0) {
            execute(ns, scriptName, hostName, targets[i], targetThreads);
        }
        targets[i].threads += targetThreads;
        threadCount += targetThreads;
    }

    if (threadCount < maxThreads) {
        let targetThreads = maxThreads - threadCount;
        if (targetThreads > 0) {
            execute(ns, scriptName, hostName, targets[targets.length - 1], targetThreads);
        }
        targets[targets.length - 1].threads += targetThreads;
        threadCount += targetThreads;
    }

    if (threadCount < maxThreads) {
        ns.tprintf(`Remaining threads on ${server}`);
    }

    targets.sort((a, b) => a.threads - b.threads);
    let totalThreads = 0;
    for (let target of targets) {
        ns.tprint(`Target: ${target.name}, Threads startet: ${target.threads}`);
        totalThreads += target.threads;
    }
    ns.tprint(`Total Threads startet: ${totalThreads}`);
}

/** @param {import("../../NetscriptDefinitions").NS} ns */
function execute(ns, scriptName, server, target, threads) {
    ns.exec(scriptName, server, threads, target.name);
    ns.print(`Execute ${scriptName} at ${server} -> ${target} with ${threads} threads.`);
}
