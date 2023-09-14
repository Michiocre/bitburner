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