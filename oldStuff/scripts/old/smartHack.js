/** @param {import(".").NS} ns */
export async function main(ns) {
    let target = ns.args[0];

    ns.disableLog('ALL');

    let moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    let securityThresh = ns.getServerMinSecurityLevel(target) + 5;
    while (true) {
        let securityLevel = ns.getServerSecurityLevel(target);
        let money = ns.getServerMoneyAvailable(target);
        if (securityLevel > securityThresh) {
            ns.print(`WeakenTime: ${ns.getWeakenTime(target)}`);
            let decrease = await ns.weaken(target);
            ns.print(`Weaken: ${securityLevel} -> ${securityLevel - decrease}`)
        } else if (money < moneyThresh) {
            ns.print(`GrowTimer: ${ns.getGrowTime(target)}`);
            let multiplier = await ns.grow(target);
            ns.print(`Grow: ${money} -> ${money * multiplier}`);
        } else {
            ns.print(`HackTimer: ${ns.getHackTime(target)}`);
            let stolenMoney = await ns.hack(target);
            ns.print(`Hack: ${stolenMoney}`);
        }
    }
}