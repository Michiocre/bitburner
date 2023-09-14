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

export class Server {
    /**
     * @param {String} name
     */
    constructor(name) {
        this.name = name;
        this.target = false;
        this.root = false;
        this.growTimer = 0;
        this.hackTimer = 0;
        this.weakenTimer = 0;

        this.moneyStolenPerSecondQueue = [];
        this.securityIncreasePerSecondQueue = [];
    }

    /** @returns {Boolean} */
    isHome() {
        return this.name === 'home';
    }

    /**
     * @param {Number} money
     * @returns {Boolean}
     */
    queueMoneyStolenPerSec(money) {
        this.moneyStolenPerSecondQueue.push(money);
        return this.moneyStolenPerSecondQueue.shift();
    }

    /**
     * @param {Number} security
     * @returns {Boolean}
     */
    queueSecurityIncreasePerSec(security) {
        this.securityIncreasePerSecondQueue.push(security);
        return this.securityIncreasePerSecondQueue.shift();
    }

    /**
     * @returns {Number}
     */
    averageMoneyStolenPerSec() {
        if (this.moneyStolenPerSecondQueue.length === 0) {
            return 0;
        }
        return this.moneyStolenPerSecondQueue.reduce((p, c) => p + c, 0) / this.moneyStolenPerSecondQueue.length;
    }

    /**
     * @returns {Number}
     */
    averageSecurityIncreasePerSec() {
        if (this.securityIncreasePerSecondQueue.length === 0) {
            return 0;
        }
        return this.securityIncreasePerSecondQueue.reduce((p, c) => p + c, 0) / this.securityIncreasePerSecondQueue.length;
    }
}

/**
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
