/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let server = ns.args[0]; //Host to hack
    let server2 = ns.getHostname(); //Server to run scripts on
    let i = 0;
    let c = 0;

    let player = ns.getPlayer();
    let fserver = ns.getServer(server);
    let contstantRam = ns.getScriptRam('/advanced/OP.js'); //grabbing script RAM values
    let hackscriptRam = ns.getScriptRam('/advanced/hack.js');
    let growscriptRam = ns.getScriptRam('/advanced/grow.js');
    let weakenscriptRam = ns.getScriptRam('/advanced/weaken.js');
    let maxRam = ns.getServerMaxRam(server2) - contstantRam; //getting total RAM I can use that doesnt include the OP script
    let weakenThreads = 2000 - ns.getServerMinSecurityLevel(server) / 0.05;

    ns.weaken()

    let maxGrowThreads = maxRam / growscriptRam - weakenscriptRam * 2000;
    let cs = ns.getServerSecurityLevel(server);
    let ms = ns.getServerMinSecurityLevel(server);
    let mm = ns.getServerMaxMoney(server);
    let ma = ns.getServerMoneyAvailable(server);

    //Priming the server.  Max money and Min security must be acheived for this to work
    if (ma < mm == true) {
        ns.exec('/advanced/weaken.js', server2, 2000, server, 0);
        ns.exec('/advanced/grow.js', server2, maxGrowThreads, server, 0);
        let WeakenTime = ns.formulas.hacking.weakenTime(fserver, player);
        await ns.sleep(WeakenTime + 1000);
        mm = ns.getServerMaxMoney(server);
        ma = ns.getServerMoneyAvailable(server);
        player = ns.getPlayer();
        fserver = ns.getServer(server);
        cs = ns.getServerSecurityLevel(server);
        ms = ns.getServerMinSecurityLevel(server);
    }

    //If Max Money is true, making sure security level is at its minimum
    if (cs > ms == true) {
        ns.exec('/newserver/weaken.js', server2, 2000, server, 0);
        WeakenTime = ns.formulas.hacking.weakenTime(fserver, player);
        await ns.sleep(WeakenTime + 1000);
        cs = ns.getServerSecurityLevel(server);
        ms = ns.getServerMinSecurityLevel(server);
    }

    ns.tprint('Finished Priming');

    //Refreshing server stats now that the security level is at the minmum, and maybe our player stats have changed as priming can take a while
    player = ns.getPlayer();
    fserver = ns.getServer(server);

    let HPercent = ns.formulas.hacking.hackPercent(fserver, player) * 100;
    let GPercent = ns.formulas.hacking.growPercent(fserver, 1, player, 1);
    WeakenTime = ns.formulas.hacking.weakenTime(fserver, player);
    let GrowTime = ns.formulas.hacking.growTime(fserver, player);
    let HackTime = ns.formulas.hacking.hackTime(fserver, player);

    let growThreads = Math.round(5 / (GPercent - 1)); //Getting the amount of threads I need to grow 200%.  I only need 100% but I'm being conservative here
    let hackThreads = Math.round(50 / HPercent); //Getting the amount of threads I need to hack 50% of the funds
    weakenThreads = Math.round(weakenThreads - growThreads * 0.004); //Getting required threads to fully weaken the server

    let totalRamForRun = hackscriptRam * hackThreads + growscriptRam * growThreads + weakenscriptRam * weakenThreads; //Calculating how much RAM is used for a single run
    let sleepTime = WeakenTime / (maxRam / totalRamForRun); //finding how many runs this server can handle and setting the time between run execution

    //if (sleepTime<500) // Testing forcing a min sleep time of 500 ms
    //{sleepTime = 500;
    //}

    let shiftCount = maxRam / totalRamForRun;
    let offset = sleepTime / 2;
    let gOffset = offset / 4;
    let hOffset = offset / 2;

    while (true) {
        let wsleep = 0; //At one point I made the weaken call sleep so I've kept it around
        let gsleep = WeakenTime - GrowTime - gOffset; //Getting the time to have the Growth execution sleep, then shaving some off to beat the weaken execution
        let hsleep = WeakenTime - HackTime - hOffset; //Getting time for hack, shaving off more to make sure it beats both weaken and growth
        let UsedRam = ns.getServerUsedRam(server2);

        if (totalRamForRun >= maxRam - UsedRam == false) {
            //making sure I have enough RAM to do a full run
            ns.exec('/newserver/weaken.js', server2, weakenThreads, server, wsleep, i);
            ns.exec('/newserver/grow.js', server2, growThreads, server, gsleep, i);
            ns.exec('/newserver/hack.js', server2, hackThreads, server, hsleep, i);

            if (c < shiftCount) {
                await ns.sleep(sleepTime);
                c++;
            } else {
                await ns.sleep(sleepTime + offset);
                c = 0;
            }

            i++;
        } else {
            await ns.sleep(1000);
        }
    }
    await ns.sleep(120000);
}

/** @param {import("../../NetscriptDefinitions").AutocompleteData} data */
export function autocomplete(data, args) {
    return [...data.servers]
}