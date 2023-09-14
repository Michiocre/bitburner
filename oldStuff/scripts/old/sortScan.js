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
export async function main(ns) {
    let targets = [];
	await getChildren(ns, 'home', '', targets);

	targets = targets.sort((a, b) => ns.getServerMaxMoney(a) - ns.getServerMaxMoney(b));

	for (let target of targets) {
		let money = Math.floor(ns.getServerMaxMoney(target)).toString().padEnd(14);
		ns.tprint(`> ${target.padEnd(20)}|Money: ${money}|Hacking: ${ns.getServerRequiredHackingLevel(target).toString().padEnd(5)}`);
	}
}