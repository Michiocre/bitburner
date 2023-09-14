/** @param {import(".").NS} ns */
export async function main(ns) {
    let message = ns.args.join(' ');
    ns.writePort(20, message);
}