/** @param {import("..").NS} ns */
export async function main(ns) {
	let baseRam = 8;
	let upgradeMultiplier = 32;
	let hackRam = ns.getScriptRam('hack.js', hostName);

    let servers = ns.getPurchasedServers();
	let ramGoal = getLowestRam(servers) * upgradeMultiplier;

	if (lowestRam == 0) {
		let baught = 0;
		for (let i = servers.length - 1; i < ns.getPurchasedServerLimit(); i++) {
			if (ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(baseRam)) {
				baught++;
				let newServer = ns.purchaseServer("blank-" + i, baseRam);
				await ns.scp('hack.js', newServer);
				ns.exec('hack.js', newServer, 3);
			}
		}
		ns.tprint(`Baught ${baught} servers with ${baseRam}gb each. For a total of ${servers.length + baught}.`);
		return;
	}

	servers.filter((s) => ns.getServerMaxRam(s) <= ramGoal);

	for (let server of servers) {
		let upgraded = 0;
		if (ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(ramGoal)) {
			upgraded++;
			ns.killall(server);
			ns.deleteServer(server);

			let maxThreads = Math.floor(ramGoal / hackRam);

			let newServer = ns.purchaseServer(server, ramGoal);
			await ns.scp('hack.js', newServer);
			ns.exec('hack.js', newServer, maxThreads);
		}
		ns.tprint(`Upgraded ${upgraded} Server to ${ramGoal}gb.`);
	}
}

/** @param {String[]} servers */
function getLowestRam(servers) {
	if (servers.length < 25) {
		return 0;
	}
	let ram = Number.POSITIVE_INFINITY;
	for (let server of servers) {
		if (ns.getPurchasedServerMaxRam(server) < ram) {
			ram = ns.getPurchasedServerMaxRam(server);
		}
	}

	return ram;
}