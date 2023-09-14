/** @type import(".").NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;
    let url = 'http://localhost:3030/';
    let tempFile = 'temp_files.txt';
    await ns.wget(url, tempFile);

    let filesString = ns.read(tempFile);
    let files = JSON.parse(filesString);

    if (files.includes(ns.args[0])) {
        let fileUrl = url + files[0];
        if (files[0].includes('/')) {
            files[0] = '/' + files[0];
        }

        await ns.wget(fileUrl, files[0]);

        for (let server of ns.getPurchasedServers()) {
            await ns.scp(files[0], ns.getHostname(), server);
        }
    } else {
        for (let file of files) {
            let fileUrl = url + file;
            if (file.includes('/')) {
                file = '/' + file;
            }

            await ns.wget(fileUrl, file);
        }
    }

    ns.rm(tempFile);
}
