/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	let target = ns.args[0];

	ns.disableLog('ALL');

	let money = ns.getServerMoneyAvailable(target);
	let oldMoney = 0;

	let security = ns.getServerSecurityLevel(target);
	let oldSecurity = 0;

	while (true) {
		if (money != oldMoney) {
			ns.print(`Money: ${Math.floor(money)}`);
		}
		oldMoney = money;
		money = ns.getServerMoneyAvailable(target);
		if (security != oldSecurity) {
			ns.print(`Security: ${Math.floor(security)}`);
		}
		oldSecurity = security;
		security = ns.getServerSecurityLevel(target);
		await ns.sleep(1000);
	}
}

/** @param {import("../../NetscriptDefinitions").AutocompleteData} data */
export function autocomplete(data, args) {
    return [...data.servers]
}