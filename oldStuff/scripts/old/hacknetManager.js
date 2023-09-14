let maxLevel = 200;
let maxRam = 64;
let maxRamUpgrades = 7;
let maxCores = 16;

let buyThreshold = 0.05;

/** @param {import("../.").NS} ns */
export async function main(ns) {
	let nodeCount = ns.hacknet.numNodes();
	
	for (let i = 0; i < nodeCount; i++) {
		let nodeStats = ns.hacknet.getNodeStats(i);
		if (nodeStats.level === maxLevel && nodeStats.ram === maxRam && nodeStats.cores === maxCores) {
			continue;
		}
		await upgradeNode(ns, i);
	}
	
	while (ns.hacknet.numNodes() < ns.hacknet.maxNumNodes()) {
		let currentMoney = ns.getServerMoneyAvailable('home');

		let cost = ns.hacknet.getPurchaseNodeCost();
		if (cost / currentMoney < buyThreshold) {
			let node = ns.hacknet.purchaseNode();
			await upgradeNode(ns, node);
		}

		await ns.sleep(1000);
	}
}

/**
 * @param {import(".").NS} ns
 * @param {Number} node
*/
async function upgradeNode(ns, node) {
	let fullUpgrades = false;
	let nodeStats = ns.hacknet.getNodeStats(node);
	while (!fullUpgrades) {
		let currentMoney = ns.getServerMoneyAvailable('home');
		let cost = ns.hacknet.getLevelUpgradeCost(node, maxLevel - nodeStats.level);
		cost += ns.hacknet.getRamUpgradeCost(node, maxRamUpgrades - nodeStats.ram);
		cost += ns.hacknet.getCoreUpgradeCost(node, maxCores - nodeStats.cores);

		if (cost / currentMoney < buyThreshold) {
			ns.hacknet.upgradeLevel(node, maxLevel - nodeStats.level);
			ns.hacknet.upgradeRam(node, maxRamUpgrades - nodeStats.ram);
			ns.hacknet.upgradeCore(node, maxCores - nodeStats.cores);
			fullUpgrades = true;
		}

		await ns.sleep(1000);
	}
}