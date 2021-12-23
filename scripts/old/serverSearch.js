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
    let target = ns.args[0];
	ns.tprint(await findServer(ns, 'home', '', target));
}