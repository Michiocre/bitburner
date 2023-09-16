import { ServerTree } from './lib/serverTree.js';

/**
 * @description Squishes numbers so they arent as long.
 * @param {Number} number
 * @param {Boolean} bytes
 * @returns {String}
 */
export function numberSquish(number, bytes) {
    if (number == 0) {
        return bytes ? '0GB' : '0.000';
    }
    let letters = bytes ? ['GB', 'TB', 'PB'] : ['', 'k', 'm', 'b', 't', 'q'];
    let index = Math.floor(Math.log10(Math.abs(number)) / 3);

    if (index > 0) {
        number = number / Math.pow(1000, index);
    }

    let letter;
    if (index >= letters.length) {
        letter = 'ADD MORE LETTER';
    } else if (index < 0) {
        letter = '';
    } else {
        letter = letters[index];
    }

    return number.toLocaleString('en-UK', { maximumFractionDigits: bytes ? 0 : 3, minimumFractionDigits: bytes ? 0 : 3 }) + letter;
}

/**
 * @description Returns array with all the servers
 * @param {import("../../NetscriptDefinitions").NS} ns
 * @returns {ServerTree[]}
 */
export function getServerArray(ns) {
    let root = getChildren(ns, 'home', '');
    return root.toStringArray();
}

/**
 * @description Returns a servertree
 * @param {import("../../NetscriptDefinitions").NS} ns
 * @returns {ServerTree}
 */
export function getServerTree(ns) {
    return getChildren(ns, 'home', '');
}

/**
 * @description Returns the serverTree of the given server 
 * @param {import("../../NetscriptDefinitions").NS} ns
 * @returns {ServerTree} 
 */
function getChildren(ns, currentName, parentPath) {
    let children = ns.scan(currentName);
    let path = parentPath + ' > ' + currentName;

    let server = new ServerTree(currentName, [], path);

    for (let child of children) {
        if (parentPath.split(' ').pop() === child) {
            continue;
        }
        server.children.push(getChildren(ns, child, path));
    }

    return server;
}
