/** @param {import(".").NS} ns */
export async function main(ns) {
    let server = ns.getHostname();
    let target = ns.args[0];
    let wScriptRam = ns.getScriptRam('workerWeaken.js');
    let gScriptRam = ns.getScriptRam('workerGrow.js');
    let hScriptRam = ns.getScriptRam('workerHack.js');

    let usableRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);

    //Prime Money
    let maxMoney = ns.getServerMaxMoney(target);
    let money = Math.max(ns.getServerMoneyAvailable(target), 1);

    while (money < maxMoney) {
        let multiplier = maxMoney / money;
        let maxGThreads = Math.floor((usableRam - wScriptRam * 2000) / gScriptRam);
        let gThreads = Math.min(Math.ceil(ns.growthAnalyze(target, multiplier)), maxGThreads);

        ns.exec('workerGrow.js', server, gThreads, target);
        ns.exec('workerWeaken.js', server, 2000, target);

        await ns.sleep(ns.getWeakenTime(target) + 1000);

        money = ns.getServerMoneyAvailable(target);
    }

    ns.tprint('Money Primed');

    //If security left
    if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
        ns.exec('workerWeaken.js', server, 2000, target);
        await ns.sleep(ns.getWeakenTime(target) + 1000);
    }
    ns.tprint('Security Primed');

    let wTime = ns.getWeakenTime(target);
    let gTime = ns.getGrowTime(target);
    let hTime = ns.getHackTime(target);

    let gThreads = ns.growthAnalyze(target, 3);
    let hThreads = Math.floor(ns.hackAnalyzeThreads(target, ns.getServerMaxMoney(target) * 0.45));
    let gSecGain = ns.growthAnalyzeSecurity(gThreads);
    let hSecGain = ns.hackAnalyzeSecurity(hThreads);
    let wThreads = Math.ceil((gSecGain + hSecGain + 10) / 0.05);

    let ramForRun = wScriptRam * wThreads + gScriptRam * gThreads + hScriptRam * hThreads;
    let parallelRuns = usableRam / ramForRun;
    let sleepTime = wTime / parallelRuns;

    if (sleepTime < 500) {
        sleepTime = 500;
    }

    let offset = sleepTime / 2;
    let gOffset = offset / 4;
    let hOffset = offset / 2;

    let totalRunCount = 0;
    let runCount = 0;

    while (true) {
        if (ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target) > 0) {
            ns.tprint('FAILED SINCE SEC IS TO HIGH');
            ns.exit();
        }

        let wSleep = 0;
        let gSleep = wTime - gTime - gOffset;
        let hSleep = wTime - hTime - hOffset;

        let freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);

        if (freeRam > ramForRun) {
            ns.exec('workerWeaken.js', server, wThreads, target, wSleep, totalRunCount);
            ns.exec('workerGrow.js', server, gThreads, target, gSleep, totalRunCount);
            ns.exec('workerHack.js', server, hThreads, target, hSleep, totalRunCount);

            if (runCount < parallelRuns) {
                await ns.sleep(sleepTime);
                runCount++;
            } else {
                await ns.sleep(sleepTime + offset);
                runCount = 0;
            }

            totalRunCount++;
        } else {
            await ns.sleep(1000);
        }
    }
}
