import { getServerArray } from './scan.js';
import { Server, numberSquish } from './lib.js';

/** @type {import(".").NS} ns */
let ns;

let hostName = '';
let purchasedServers = [];
/** @type {Server[]} */
let servers = [];

let serverBudget = 0.1;
let hacknetBudget = 0.1;
let portLevel = 0;

let homeRamHeadroom = 1024;
let hackScript = { name: 'workerHack.js', size: NaN };
let growScript = { name: 'workerGrow.js', size: NaN };
let weakenScript = { name: 'workerWeaken.js', size: NaN };

export async function main(_ns) {
    ns = _ns;
    ns.disableLog('ALL');
    ns.enableLog('exec');
    ns.clearPort(20);

    hostName = ns.getHostname();

    hackScript.size = ns.getScriptRam(hackScript.name);
    growScript.size = ns.getScriptRam(growScript.name);
    weakenScript.size = ns.getScriptRam(weakenScript.name);

    for (let server of await getServerArray(ns)) {
        servers.push(new Server(server));
    }
    servers.sort((a, b) => ns.getServerMaxMoney(a.name) - ns.getServerMaxMoney(b.name));

    ns.tprint('Setup complete, GameManager is running. (Use the handler.js function to interact with the running process.)');
    await nukeServers();
    await addTargets();

    let counter = 0;

    //Main Loop
    while (true) {
        let command = '';
        if ((command = ns.readPort(20)) != 'NULL PORT DATA') {
            let parts = command.split(' ');
            switch (parts[0]) {
                case 'help':
                    ns.tprint('do help      | Provides a list of commands and their uses.');
                    ns.tprint('do contracts | Searches for contracts in the network and solves them.');
                    ns.tprint('do hacknet   | Buys and upgrades hacknet nodes.');
                    ns.tprint('do shutdown  | Stops the process.');
                    break;
                case 'contracts':
                    let contracts = await manageContracts();
                    if (contracts == 0) {
                        ns.tprint('CONTRACTS: No contracts found.');
                    }
                    break;
                case 'hacknet':
                    await manageHacknet();
                    break;
                case 'scan':
                    ns.exec('scan.js', hostName, 1, 'filter', ...servers.filter((s) => s.target).map((s) => s.name));
                    break;
                case 'shutdown':
                    ns.tprint('Shutting down...');
                    ns.exit();
                    break;
                default:
                    ns.tprintf('Recieved unkown command: %s', command);
                    break;
            }
        }

        if (counter % 200 === 199) {
            await addTargets();
        }

        if (counter % 1000 === 50) {
            await manageServers();
        }

        if (counter % 1000 === 0) {
            await manageHacknet();
        }

        if (counter % 10000 === 0) {
            await manageContracts();
        }

        // if (counter % 50 === 0) {
        //     numberSquish(await manageHacks(), true);
        // }

        await ns.sleep(100);
        counter = (counter + 1) % 10000;
    }
}

async function manageServers() {
    let ramSteps = 16;
    let buyC = 0;
    let upgradeC = 0;
    purchasedServers = ns.getPurchasedServers();

    for (let i = purchasedServers.length; i < ns.getPurchasedServerLimit(); i++) {
        if (ns.getServerMoneyAvailable(hostName) * serverBudget < ns.getPurchasedServerCost(ramSteps)) {
            break;
        }

        purchasedServers.push(ns.purchaseServer('blank-' + i, ramSteps));
        buyC++;
    }

    for (let i = 0; i < purchasedServers.length; i++) {
        let currentRam = ns.getServerMaxRam(purchasedServers[i]);
        if (currentRam * ramSteps > ns.getPurchasedServerMaxRam()) {
            continue;
        }
        if (ns.getServerMoneyAvailable(hostName) * serverBudget < ns.getPurchasedServerCost(currentRam * ramSteps)) {
            continue;
        }

        ns.killall(purchasedServers[i]);
        ns.deleteServer(purchasedServers[i]);
        ns.purchaseServer(purchasedServers[i], currentRam * ramSteps);
        upgradeC++;
    }

    if (buyC) {
        ns.tprintf('SERVER: Baught %i new Server(s).', buyC);
    }
    if (upgradeC) {
        ns.tprintf('SERVER: Upgraded %i Server(s) (x16).', upgradeC);
    }
}

async function manageHacknet() {
    let levelUpgradeStep = 20;
    let ramUpgradeStep = 1;
    let coreUpgradeStep = 2;

    let buyC = 0;
    let upgradeC = 0;

    for (let i = ns.hacknet.numNodes(); i < ns.hacknet.maxNumNodes(); i++) {
        if (ns.getServerMoneyAvailable(hostName) * hacknetBudget < ns.hacknet.getPurchaseNodeCost()) {
            break;
        }

        ns.hacknet.purchaseNode();
        buyC++;
    }

    for (let i = 0; i < ns.hacknet.numNodes(); i++) {
        let partialUpgrade = 0;
        while (ns.getServerMoneyAvailable(hostName) * hacknetBudget > ns.hacknet.getLevelUpgradeCost(i, levelUpgradeStep)) {
            ns.hacknet.upgradeLevel(i, levelUpgradeStep);
            partialUpgrade++;
        }

        while (ns.getServerMoneyAvailable(hostName) * hacknetBudget > ns.hacknet.getRamUpgradeCost(i, ramUpgradeStep)) {
            ns.hacknet.upgradeRam(i, ramUpgradeStep);
            partialUpgrade++;
        }

        while (ns.getServerMoneyAvailable(hostName) * hacknetBudget > ns.hacknet.getCoreUpgradeCost(i, coreUpgradeStep)) {
            ns.hacknet.upgradeCore(i, coreUpgradeStep);
            partialUpgrade++;
        }

        if (partialUpgrade) {
            upgradeC++;
        }
    }

    if (buyC) {
        ns.tprintf('HACKNET: Baught %i new Hacknode(s).', buyC);
    }
    if (upgradeC) {
        ns.tprintf('HACKNET: Upgraded %i Hacknode(s).', upgradeC);
    }
}

async function manageContracts() {
    let contracts = [];
    for (let server of servers) {
        for (let file of ns.ls(server.name, '.cct')) {
            contracts.push({ file: file, server: server.name });
        }
    }

    if (contracts.length <= 0) {
        return 0;
    }

    ns.tprintf('Found %i contracts, starting the solvers...', contracts.length);

    let solved = 0;

    for (let contract of contracts) {
        let contractType = ns.codingcontract.getContractType(contract.file, contract.server);
        let script = '';
        switch (contractType) {
            case 'Subarray with Maximum Sum':
                script = 'contract/subarrayWithMaximumSum.js';
                break;
            case 'Generate IP Addresses':
                script = 'contract/generateIPAddresses.js';
                break;
            case 'Find All Valid Math Expressions':
                script = 'contract/findAllValidMathExpressions.js';
                break;
            case 'Find Largest Prime Factor':
                script = 'contract/findLargestPrimeFactor.js';
                break;
            case 'Algorithmic Stock Trader I':
                script = 'contract/algorithmicStockTraderI.js';
                break;
            case 'Algorithmic Stock Trader II':
                script = 'contract/algorithmicStockTraderII.js';
                break;
            case 'Algorithmic Stock Trader III':
                script = 'contract/algorithmicStockTraderIII.js';
                break;
            case 'Algorithmic Stock Trader IV':
                script = 'contract/algorithmicStockTraderIV.js';
                break;
            case 'Total Ways to Sum':
                script = 'contract/totalWaysToSum.js';
                break;
            case 'Array Jumping Game':
                script = 'contract/arrayJumpingGame.js';
                break;
            case 'Merge Overlapping Intervals':
                script = 'contract/mergeOverlappingIntervals.js';
                break;
            case 'Unique Paths in a Grid I':
                script = 'contract/uniquePathsInAGridI.js';
                break;
            case 'Unique Paths in a Grid II':
                script = 'contract/uniquePathsInAGridII.js';
                break;
            case 'Sanitize Parentheses in Expression':
                script = 'contract/sanitizeParenthesesInExpression.js';
                break;
            case 'Minimum Path Sum in a Triangle':
                script = 'contract/minimumPathSumInATriangle.js';
                break;
            case 'Spiralize Matrix':
                script = 'contract/spiralizeMatrix.js';
                break;
            default:
                ns.tprintf('CONTRACTS: Found contract %s of type %s on %s', contract.file, contractType, contract.server);
                ns.tprintf('CONTRACTS: %s', ns.codingcontract.getDescription(contract.file, contract.server));
                ns.tprint('CONTRACTS: ' + '-'.repeat(40));
                break;
        }

        if (script != '') {
            if (ns.run(script, 1, contract.file, contract.server) > 0) solved++;
        }
    }

    ns.tprintf('CONTRACTS: Solved %i contracts, %i contracts remain unsolved.', solved, contracts.length - solved);
    return contracts.length;
}

async function manageHacks() {
    let missingRam = 0;
    for (let target of servers.filter((item) => item.target)) {
        let money = ns.getServerMoneyAvailable(target.name);
        let maxMoney = ns.getServerMaxMoney(target.name);
        let moneyP = money / maxMoney;
        let security = ns.getServerSecurityLevel(target.name);
        let minSecurity = ns.getServerMinSecurityLevel(target.name);

        if (security < minSecurity * 1.2) {
            if (moneyP < 0.95 && target.growTimer < ns.getTimeSinceLastAug()) {
                let extraMoneyToRegrow = target.averageMoneyStolenPerSec() * ns.getGrowTime(target.name);

                let growthMultiplier = (maxMoney - extraMoneyToRegrow) / money;
                if (money === 0) {
                    growthMultiplier = 1000;
                }

                let growThreads = Math.ceil(ns.growthAnalyze(target.name, growthMultiplier));
                while (growThreads > 0) {
                    let server = servers.find((item) => {
                        let serverRam = ns.getServerMaxRam(item.name) - ns.getServerUsedRam(item.name);
                        if (item.isHome()) {
                            serverRam -= homeRamHeadroom;
                        }
                        return serverRam > growScript.size && item.root;
                    });

                    if (server) {
                        let serverRam = ns.getServerMaxRam(server.name) - ns.getServerUsedRam(server.name);
                        if (server.isHome()) {
                            serverRam -= homeRamHeadroom;
                        }
                        let serverThreads = Math.floor(serverRam / growScript.size);
                        serverThreads = Math.min(serverThreads, growThreads);

                        target.growTimer = ns.getGrowTime(target.name) + ns.getTimeSinceLastAug() + 10;
                        ns.exec(growScript.name, server.name, serverThreads, target.name);

                        server.queueSecurityIncreasePerSec(ns.growthAnalyzeSecurity(serverThreads) / ns.getGrowTime(server.name));

                        growThreads -= serverThreads;
                    } else {
                        ns.print(ns.sprintf('No server was found with ram for %i grow scripts.', growThreads));
                        missingRam += growThreads * growScript.size;
                        break;
                    }
                }
            }

            if (moneyP > 0.9 && target.hackTimer < ns.getTimeSinceLastAug()) {
                let hackThreads = Math.ceil(ns.hackAnalyzeThreads(target.name, money * 0.4));
                while (hackThreads > 0) {
                    let server = servers.find((item) => {
                        let serverRam = ns.getServerMaxRam(item.name) - ns.getServerUsedRam(item.name);
                        if (item.isHome()) {
                            serverRam -= homeRamHeadroom;
                        }
                        return serverRam > hackScript.size && item.root;
                    });

                    if (server) {
                        let serverRam = ns.getServerMaxRam(server.name) - ns.getServerUsedRam(server.name);
                        if (server.isHome()) {
                            serverRam -= homeRamHeadroom;
                        }
                        let serverThreads = Math.floor(serverRam / hackScript.size);
                        serverThreads = Math.min(serverThreads, hackThreads);

                        target.hackTimer = ns.getHackTime(target.name) + ns.getTimeSinceLastAug() + 10;
                        ns.exec(hackScript.name, server.name, serverThreads, target.name);

                        server.queueSecurityIncreasePerSec(ns.hackAnalyzeSecurity(serverThreads) / ns.getHackTime(server.name));
                        server.queueMoneyStolenPerSec((ns.hackAnalyze(target.name) * serverThreads) / ns.getHackTime(server.name));

                        hackThreads -= serverThreads;
                    } else {
                        ns.print(ns.sprintf('No server was found with ram for %i hack scripts.', hackThreads));
                        missingRam += hackThreads * hackScript.size;
                        break;
                    }
                }
            }
        }

        if (security > minSecurity && target.weakenTimer < ns.getTimeSinceLastAug()) {
            let securityToReduce = security - minSecurity + target.averageSecurityIncreasePerSec() * ns.getWeakenTime(target.name);
            let weakenThreads = Math.ceil(securityToReduce / 0.05);
            while (weakenThreads > 0) {
                let server = servers.find((item) => {
                    let serverRam = ns.getServerMaxRam(item.name) - ns.getServerUsedRam(item.name);
                    if (item.isHome()) {
                        serverRam -= homeRamHeadroom;
                    }
                    return serverRam > weakenScript.size && item.root;
                });

                if (server) {
                    let serverRam = ns.getServerMaxRam(server.name) - ns.getServerUsedRam(server.name);
                    if (server.isHome()) {
                        serverRam -= homeRamHeadroom;
                    }
                    let serverThreads = Math.floor(serverRam / weakenScript.size);
                    serverThreads = Math.min(serverThreads, weakenThreads);

                    target.weakenTimer = ns.getWeakenTime(target.name) + ns.getTimeSinceLastAug() + 10;
                    ns.exec(weakenScript.name, server.name, serverThreads, target.name);

                    weakenThreads -= serverThreads;
                } else {
                    ns.print(ns.sprintf('No server was found with ram for %i weaken scripts.', weakenThreads));
                    missingRam += weakenThreads * weakenScript.size;
                    break;
                }
            }
        }
    }
    return missingRam;
}

async function addTargets() {
    for (let server of servers) {
        if (server.name == 'harakiri-sushi') {
            continue;
        }
        if (server.target) {
            continue;
        }
        if (ns.getServerMaxMoney(server.name) <= 0) {
            continue;
        }
        if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(server.name)) {
            continue;
        }
        if (portLevel < ns.getServerNumPortsRequired(server.name)) {
            continue;
        }

        server.target = true;
    }
}

async function nukeServers() {
    let rootCounter = 0;
    if (ns.fileExists('brutessh.exe')) portLevel = 1;
    if (ns.fileExists('ftpcrack.exe')) portLevel = 2;
    if (ns.fileExists('relaysmtp.exe')) portLevel = 3;
    if (ns.fileExists('httpworm.exe')) portLevel = 4;
    if (ns.fileExists('sqlinject.exe')) portLevel = 5;

    for (let server of servers) {
        if (!ns.hasRootAccess(server.name)) {
            switch (ns.getServerNumPortsRequired(server.name)) {
                case 5:
                    if (portLevel < 5) continue;
                    ns.sqlinject(server.name);
                case 4:
                    if (portLevel < 4) continue;
                    ns.httpworm(server.name);
                case 3:
                    if (portLevel < 3) continue;
                    ns.relaysmtp(server.name);
                case 2:
                    if (portLevel < 2) continue;
                    ns.ftpcrack(server.name);
                case 1:
                    if (portLevel < 1) continue;
                    ns.brutessh(server.name);
                case 0:
                    ns.nuke(server.name);
                    break;
                default:
                    continue;
            }
        }

        if (ns.hasRootAccess(server.name)) {
            if (!server.isHome()) {
                ns.rm(hackScript.name, server.name);
                ns.rm(growScript.name, server.name);
                ns.rm(weakenScript.name, server.name);
                await ns.scp([hackScript.name, growScript.name, weakenScript.name], hostName, server.name);
            }
            rootCounter++;
            server.root = true;
        }
    }

    ns.tprintf('NUKE: Nuked %i servers and installed the worker scripts.', rootCounter);
}
