import { Server } from "./lib/server.js";

export class ServerTree {
    /**
     * @param {String} name
     * @param {Server[]} children
     * @param {String} path
     */
    constructor(name, children, path) {
        this.name = name;
        this.children = children;
        this.path = path;
    }

    isHome() {
        return this.name === 'home';
    }

    /**
     * @returns {ServerTree[]} List of all the servers
     */
    toArray() {
        let list = [];
        for (const child of this.children) {
            list = list.concat(child.toArray());
        }
        return [new ServerTree(this.name, [], this.path)].concat(list);
    }

    /**
     * @returns {Array[]} List of all the servers
     */
    toStringArray() {
        let list = [];
        for (const child of this.children) {
            list = list.concat(child.toStringArray());
        }
        return [this.name].concat(list);
    }

    /**
     * @param {Number} depth
     */
    maxDepth(depth = 0) {
        let maxDepth = depth;
        for (const child of this.children) {
            maxDepth = Math.max(maxDepth, child.maxDepth(depth + 1));
        }
        return maxDepth;
    }

    longestName() {
        let nameLength = this.name.length;
        for (const child of this.children) {
            nameLength = Math.max(nameLength, child.longestName());
        }
        return nameLength;
    }
}
