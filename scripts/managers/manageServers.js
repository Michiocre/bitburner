/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let serverBudget = 0.1;
    let ramSteps = 4;
    let buyC = 0;
    let upgradeC = 0;
    let purchasedServers = ns.getPurchasedServers();
    let hostName = ns.getHostname();

    for (let i = purchasedServers.length; i < ns.getPurchasedServerLimit(); i++) {
        if (ns.getServerMoneyAvailable(hostName) * serverBudget < ns.getPurchasedServerCost(ramSteps)) {
            break;
        }

        purchasedServers.push(ns.purchaseServer('blank-' + i, ramSteps));
        buyC++;
    }

    for (let i = 0; i < purchasedServers.length; i++) {
        let currentRam = ns.getServerMaxRam(purchasedServers[i]);
        if (currentRam * ramSteps > ns.getPurchasedServerMaxRam()) {
            continue;
        }
        if (ns.getServerMoneyAvailable(hostName) * serverBudget < ns.getPurchasedServerCost(currentRam * ramSteps)) {
            continue;
        }

        ns.killall(purchasedServers[i]);
        ns.deleteServer(purchasedServers[i]);
        ns.purchaseServer(purchasedServers[i], currentRam * ramSteps);
        upgradeC++;
    }

    if (buyC) {
        ns.tprintf('SERVER: Baught %i new Server(s).', buyC);
    }
    if (upgradeC) {
        ns.tprintf('SERVER: Upgraded %i Server(s) (x%i).', upgradeC, ramSteps);
    }
}