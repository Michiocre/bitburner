import { numberSquish } from './lib/functions.js';

/** @param {import("../../NetscriptDefinitions.js").NS} ns */
export async function main(ns) {
    let symbols = ns.stock.getSymbols();

    let budget = ns.getServerMoneyAvailable('home') * (Number.parseFloat(ns.args[0]) || 0);
    let totalSpent = 0;

    while (true) {
        let spendingMoney = budget - totalSpent;

        symbols.sort((a, b) => Math.abs(ns.stock.getForecast(b) - 0.5) - Math.abs(ns.stock.getForecast(a) - 0.5));

        for (let symbol of symbols) {
            let forecast = ns.stock.getForecast(symbol);
            let position = ns.stock.getPosition(symbol);
            if (forecast > 0.6) {
                let price = ns.stock.getAskPrice(symbol);
                let amount = Math.min(Math.floor(spendingMoney / price), ns.stock.getMaxShares(symbol)) - position[0];
                if (ns.stock.buyStock(symbol, amount) > 0) {
                    ns.tprint('Baught long: ' + symbol + ' * ' + position[0]);
                    totalSpent += price;
                }
            } else if (forecast < 0.4) {
                // let price = ns.stock.getBidPrice(symbol);
                // let amount = Math.min(Math.floor(spendingMoney / price), ns.stock.getMaxShares(symbol)) - position[2];
                // if (ns.stock.short(symbol, amount) > 0) {
                //     ns.tprint('Baught short: ' + symbol + ' * ' + position[0]);
                //     totalSpent += price;
                // }
            }
        }

        let earned = 0;

        for (let symbol of symbols) {
            let position = ns.stock.getPosition(symbol);
            let forecast = ns.stock.getForecast(symbol);
            if (position[0] > 0 && forecast < 0.5) {
                if (ns.stock.sellStock(symbol, position[0])) {
                    earned += ns.stock.getSaleGain(symbol, position[0], 'Long');
                    ns.tprint('Sold long: ' + symbol + ' * ' + position[0]);
                } else {
                    ns.tprint('ERROR WHILE SELLING');
                }
            }
            if (position[2] > 0 && forecast > 0.5) {
                if (ns.stock.sellShort(symbol, position[2]) > 0) {
                    earned += ns.stock.getSaleGain(symbol, position[2], 'Short');
                    ns.tprint('Sold short: ' + symbol + ' * ' + position[0]);
                } else {
                    ns.tprint('ERROR WHILE SELLING');
                }
            }
        }

        budget += earned * 0.9;
        if (earned > 0) ns.tprint('SpendingMoney: (For every Earing only 90% is added back to the budget): ' + numberSquish(budget - totalSpent));

        await ns.sleep(2000);
    }
}
