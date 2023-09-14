/** @param {import("../.").NS} ns */
async function getChildren(ns, current, parent, list) {
	let children = await ns.scan(current);
	for (let child of children) {
		if (parent === child) {
			continue;
		}
		list.push(child);

		await getChildren(ns, child, current, list);
	}
}

/** @param {import("../.").NS} ns */
async function findServer(ns, current, parent, search) {
	if (current === search) {
		return current;
	}
	let children = await ns.scan(current);
	for (let child of children) {
		if (parent === child) {
			continue;
		}
		let childValue = await findServer(ns, child, current, search);
		if (childValue != '') {
			return current + '>' + childValue;
		}
	}
	return '';
}

/** @param {import("../.").NS} ns */
export async function main(ns) {
	let targets = [];
	await getChildren(ns, 'home', '', targets);

	let purchasedServers = ns.getPurchasedServers();
	targets = targets.filter(server => !purchasedServers.includes(server));
	
	let contractServers = targets.filter(server => ns.ls(server).find(file => file.endsWith('.cct')));

	if (contractServers.length < 1) {
		ns.tprint('No contract found.');
		return;
	}

	for (let contractServer of contractServers) {
		ns.tprint('Found contract on: ' + await findServer(ns, 'home', '', contractServer));
	}
}