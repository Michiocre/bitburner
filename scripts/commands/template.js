let _flags = [
    ['help', false]
]

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let flags = ns.flags(_flags);

    let args = flags._;
    
    if (args.includes('help') || flags.help) {
        ns.tprint(`usage: template [--help]`);
        return;
    }
}

/** @param {import("../../NetscriptDefinitions").AutocompleteData} data */
export function autocomplete(data, args) {
    data.flags(_flags)
    return [];
}