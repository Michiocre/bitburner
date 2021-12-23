import { getServerArray } from './scan.js';
import { Server, numberSquish } from './lib.js';

/** @type {import(".").NS} ns */
let ns;

let hostName = '';
let purchasedServers = [];
/** @type {Server[]} */
let servers = [];
let targets = [];

let serverBudget = 0.1;
let hacknetBudget = 0.1;
let portLevel = 0;

let zoomHackers = [];

let hackScript = 'workerHack.js';
let growScript = 'workerGrow.js';
let weakenScript = 'workerWeaken.js';

export async function main(_ns) {
    ns = _ns;
    ns.disableLog('ALL');
    ns.enableLog('exec');
    ns.clearPort(20);

    hostName = ns.getHostname();

    for (let server of await getServerArray(ns)) {
        servers.push(new Server(server));
    }
    purchasedServers = ns.getPurchasedServers();

    ns.tprint('Setup complete, GameManager is running. (Use the handler.js function to interact with the running process.)');
    await nukeServers();
    await addTargets();

    await initHacks();

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

        if (counter % 50 === 0) {
            await manageHacks();
        }

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

async function initHacks() {
    targets.sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a));
    servers.sort((a, b) => ns.getServerMaxRam(b.name) - ns.getServerMaxRam(a.name));

    for (const server of servers) {
        if (server.isHome()) {
            continue;
        }

        let target = targets.find((t) => !zoomHackers.includes(t));
        if (!target) {
            break;
        }

        zoomHackers.push(target);
        ns.exec('zoomHacker.js', server.name, 1, target);
    }
}

async function initHacks() {
    let message;
    while ((message = ns.readPort(10) != 'NULL PORT DATA')) {
        let [serverName, target, string] = message.split(';');

        ns.tprintf('HACKS: %s has failed hacking %s. Restarting hack.', serverName, target);
        ns.exec('zoomHacker.js', serverName, 1, target);
    }
}

async function addTargets() {
    for (let server of servers) {
        if (targets.includes(server.name)) {
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

        targets.push(server.name);
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
                ns.rm(hackScript, server.name);
                ns.rm(growScript, server.name);
                ns.rm(weakenScript, server.name);
                await ns.scp([hackScript, growScript, weakenScript], hostName, server.name);
            }
            rootCounter++;
            server.root = true;
        }

        if (purchasedServers.includes(server.name)) {
            ns.rm('zoomerHacker.js', server.name);
            await ns.scp('zoomHacker.js', hostName, server.name);
        }
    }

    ns.tprintf('NUKE: Nuked %i servers and installed the worker scripts.', rootCounter);
}
