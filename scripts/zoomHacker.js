/** @param {import(".").NS} ns */
export async function main(ns) {
    let server = ns.getHostname();
    let target = ns.args[0];

    let missingSec = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
    let gMult = ns.getServerMaxMoney(target) / ns.getServerMoneyAvailable(target);

    while (gMult > 1 || missingSec > 0) {
        if (gMult === Infinity) {
            gMult = 1000;
        }
        let gThreads = Math.ceil(ns.growthAnalyze(target, gMult));
        let extraSec = ns.growthAnalyzeSecurity(gThreads);
        let wThreads = Math.ceil((missingSec + extraSec) / 0.05);

        if (gThreads > 0) {
            ns.exec('workerGrow.js', server, gThreads, target);
        }
        if (wThreads > 0) {
            ns.exec('workerWeaken.js', server, wThreads, target);
        }
        await ns.sleep(Math.max(ns.getGrowTime(target), ns.getWeakenTime(target)) + 100);

        missingSec = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
        gMult = ns.getServerMaxMoney(target) / ns.getServerMoneyAvailable(target);
    }

    let gThreads = ns.growthAnalyze(target, 2.1);
    let hThreads = Math.floor(ns.hackAnalyzeThreads(target, ns.getServerMaxMoney(target) * 0.5));

    let gSec = ns.growthAnalyzeSecurity(gThreads);
    let hSec = ns.hackAnalyzeSecurity(hThreads);

    let wThreads = Math.ceil((gSec + hSec + 5) / 0.05);

    let wTimer = ns.getWeakenTime(target);

    let wDelay = 0;
    let gDelay = Math.floor(wTimer - ns.getGrowTime(target)) - 100;
    let hDelay = Math.floor(wTimer - ns.getHackTime(target)) - 200;

    let ramForRun = ns.getScriptRam('workerWeaken.js') + ns.getScriptRam('workerGrow.js') + ns.getScriptRam('workerHack.js');
    let freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    let maxConcurrentRuns = Math.floor(freeRam / ramForRun);
    let timeBetweenRuns = Math.max(Math.ceil(wTimer / maxConcurrentRuns), 500);

    ns.tprint(ramForRun);
    ns.tprint(freeRam);
    ns.tprint(maxConcurrentRuns);
    ns.tprint(timeBetweenRuns);

    let changer = 0;
    while (true) {
        ns.tprint(ns.getServerSecurityLevel(target));
        ns.tprint(ns.getServerMoneyAvailable(target));
        if (ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target) > 0) {
            await ns.writePort(10, ns.getHostname() + ';' + server + ';Has Failed');
            ns.exit();
        }
        ns.exec('workerWeaken.js', server, wThreads, target, wDelay, changer);
        ns.exec('workerGrow.js', server, gThreads, target, gDelay, changer);
        ns.exec('workerHack.js', server, hThreads, target, hDelay, changer);
        changer++;
        await ns.sleep(timeBetweenRuns);
    }
}
