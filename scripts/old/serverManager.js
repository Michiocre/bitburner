/** @param {import("..").NS} ns */
export async function main(ns) {
	let baseRam = 8;
	let upgradeMultiplier = 32;
	let hostName = ns.getHostname();

    let servers = ns.getPurchasedServers();
	let ramGoal = getLowestRam(servers, ns) * upgradeMultiplier;

	if (ramGoal == 0) {
		let baught = 0;
		for (let i = servers.length - 1; i < ns.getPurchasedServerLimit(); i++) {
			if (ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(baseRam)) {
				baught++;
				ns.purchaseServer("blank-" + i, baseRam);
			}
		}
		ns.tprint(`Baught ${baught} servers with ${baseRam}gb each. For a total of ${servers.length + baught}.`);
		return;
	}

	servers.filter((s) => ns.getServerMaxRam(s) <= ramGoal);


	let upgraded = 0;
	for (let server of servers) {
		if (ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(ramGoal)) {
			upgraded++;
			ns.killall(server);
			ns.deleteServer(server);
			ns.purchaseServer(server, ramGoal);
		}
	}
	if (upgraded == 0) {
		ns.tprint(`Not enough money for upgrade: ${ns.getPurchasedServerCost(ramGoal) / (1000 * 1000)}m per Server.`);
		return;
	}
	ns.tprint(`Upgraded ${upgraded} Server to ${ramGoal}gb.`);

	ns.spawn('hackManager.js');
}

/** 
 * @param {String[]} servers
 * @param {import("..").NS} ns
*/
function getLowestRam(servers, ns) {
	if (servers.length < 25) {
		return 0;
	}
	let ram = Number.POSITIVE_INFINITY;
	for (let server of servers) {
		if (ns.getServerMaxRam(server) < ram) {
			ram = ns.getServerMaxRam(server);
		}
	}

	return ram;
}