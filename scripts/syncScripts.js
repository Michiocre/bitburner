/** @type import(".").NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;
    let url = 'http://localhost:3030/';
    let tempFile = 'temp_files.txt';
    await ns.wget(url, tempFile);

    let filesString = ns.read(tempFile);
    let files = JSON.parse(filesString);

    for (let file of files) {
        if (ns.args[0]) {
            if (file != 'syncScripts.js') {
                ns.scriptKill(file, ns.getHostname());
            }
        }
        let fileUrl = url + file;
        if (file.includes('/')) {
            file = '/' + file;
        }

        await ns.wget(fileUrl, file);
    }

    ns.rm(tempFile);

    if (ns.args[0]) {
        ns.run('gameManager.js');
    }
}
