/** @param {import("..").NS} ns */
async function getChildren(ns, current, parent, list) {
	let children = await ns.scan(current);
	for (let child of children) {
		if (parent === child) {
			continue;
		}
		
		let contractFiles = ns.ls(child, '.cct');
		for (let file of contractFiles) {
			list.push([file, child]);
		}

		await getChildren(ns, child, current, list);
	}
}

/** @param {import("..").NS} ns */
export async function main(ns) {
	ns.disableLog('scan');
	let contracts = [];
	await getChildren(ns, 'home', '', contracts);
	ns.tprint(`Found ${contracts.length} contracts, starting the solvers...`);

	let solved = 0;

	for (let contract of contracts) {
		let contractType = ns.codingcontract.getContractType(contract[0], contract[1]);
		switch(contractType) {
			case 'Subarray with Maximum Sum':
				if (ns.run('contract/subarrayWithMaximumSum.js', 1, contract[0], contract[1]) > 0) solved++;
				break;
			case 'Generate IP Addresses':
				if (ns.run('contract/generateIPAddresses.js', 1, contract[0], contract[1]) > 0) solved++;
				break;
			case 'Find All Valid Math Expressions':
				if (ns.run('contract/findAllValidMathExpressions.js', 1, contract[0], contract[1]) > 0) solved++;
				break;
			case 'Find Largest Prime Factor':
				if (ns.run('contract/findLargestPrimeFactor.js', 1, contract[0], contract[1]) > 0) solved++;
				break;
			case 'Algorithmic Stock Trader I':
				if (ns.run('contract/algorithmicStockTraderI.js', 1, contract[0], contract[1]) > 0) solved++;
				break;
			case 'Algorithmic Stock Trader II':
				if (ns.run('contract/algorithmicStockTraderII.js', 1, contract[0], contract[1]) > 0);
				break;
			case 'Algorithmic Stock Trader III':
				if (ns.run('contract/algorithmicStockTraderIII.js', 1, contract[0], contract[1]) > 0);
				break;
			case 'Total Ways to Sum':
				if (ns.run('contract/totalWaysToSum.js', 1, contract[0], contract[1]) > 0) solved++;
				break;
			case 'Array Jumping Game':
				if (ns.run('contract/arrayJumpingGame.js', 1, contract[0], contract[1]) > 0) solved++;
				break;
			case 'Merge Overlapping Intervals':
				if (ns.run('contract/mergeOverlappingIntervals.js', 1, contract[0], contract[1]) > 0) solved++;
				break;
			case 'Unique Paths in a Grid I':
				if (ns.run('contract/uniquePathsInAGridI.js', 1, contract[0], contract[1]) > 0) solved++;
				break;
			case 'Sanitize Parentheses in Expression':
				if (ns.run('contract/sanitizeParenthesesInExpression.js', 1, contract[0], contract[1]) > 0);
				break;
			case 'Minimum Path Sum in a Triangle':
				if (ns.run('contract/minimumPathSumInATriangle.js', 1, contract[0], contract[1]) > 0);
				break;
			case 'Spiralize Matrix':
				if (ns.run('contract/spiralizeMatrix.js', 1, contract[0], contract[1]) > 0);
				break;
			default:
				ns.tprint(`Found contract ${contract[0]} of type '${contractType}' on ${contract[1]}`);
				ns.tprint(`Description: ${ns.codingcontract.getDescription(contract[0], contract[1])}`);
				ns.tprint('-'.repeat(40));
				break;
		}
	}

	ns.tprint(`Solved ${solved} contracts, ${contracts.length - solved} contracts remain unsolved.`);
}