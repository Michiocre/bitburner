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

    if (sleepTime < 1000) {
        sleepTime = 1000;
    }

    // H -50  | G 100 | W 200  --n00dles->  2min (G befor W)
    // H -100 | G 50  | W 200  ->
    let offset = sleepTime / 10;
    let gOffset = offset * 1.5;
    let hOffset = offset * 3;

    let globalOffset = offset * 2;

    let totalRunCount = 0;

    let lastTime = 0;

    while (true) {
        if (ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target) > 0) {
            ns.tprint('  FAILED SINCE SEC IS TO HIGH, at: ' + ns.getTimeSinceLastAug());
            ns.exit();
        }

        let wSleep = globalOffset;
        let gSleep = wTime - gTime - gOffset + globalOffset;
        let hSleep = wTime - hTime - hOffset + globalOffset;

        let freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);

        if (freeRam > ramForRun) {
            ns.exec('workerWeaken.js', server, wThreads, target, wSleep, totalRunCount);
            ns.exec('workerGrow.js', server, gThreads, target, gSleep, totalRunCount);
            ns.exec('workerHack.js', server, hThreads, target, hSleep, totalRunCount);

            totalRunCount++;
        }

        let time = ns.getTimeSinceLastAug();
        let speedUp = 0;
        if (lastTime != 0) {
            speedUp = time - lastTime - sleepTime;
            speedUp = Math.max(speedUp, 0);
        }
        await ns.sleep(sleepTime - speedUp);
        lastTime = time;
    }
}
