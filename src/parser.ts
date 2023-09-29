import fs from 'fs';
import readline from 'readline';

async function updateM3UFile(filePath: string, newUsername: string, newPassword: string) {
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(filePath + '.tmp');

    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        terminal: false
    });

    rl.on('line', (line) => {
        // Assuming that the format is http://example.com:8080/live/USERNAME/PASSWORD/123.ts
        let updatedLine = line.replace(/(username=)([^&]+)(&password=)([^&]+)(&type=m3u_plus&output=ts)/g, `$1${newUsername}$3${newPassword}$5`);
        output.write(updatedLine + '\n');
    });

    rl.on('close', () => {
        fs.renameSync(filePath + '.tmp', filePath);
        console.log('File updated successfully!');
    });
}

const m3uFilePath = process.argv[2];
const username = process.argv[3];
const password = process.argv[4];

if (!m3uFilePath || !username || !password) {
    console.log('Usage: ts-node parser.ts <path-to-m3u-file> <username> <password>');
    process.exit(1);
}

updateM3UFile(m3uFilePath, username, password);