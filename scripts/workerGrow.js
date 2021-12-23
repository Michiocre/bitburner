/** @param {import(".").NS} ns */
export async function main(ns) {
    await ns.grow(ns.args[0]);
    if (ns.args[1]) {
        await ns.sleep(ns.args[1]);
    }
}
