/** @param {import(".").NS} ns */
export async function main(ns) {
    let counter = 0;

    while (true) {
        counter++;
        ns.tprint(counter);
        ns.tprint(ns.getTimeSinceLastAug());
        await ns.sleep(10);
    }
}
