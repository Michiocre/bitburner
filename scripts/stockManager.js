/** @param {import(".").NS} ns */
export async function main(ns) {
    let symbols = ns.stock.getSymbols();

    for (let symbol of symbols) {
        ns.tprint(ns.stock.getForecast(symbol));
    }
}
