// this is designed to be run in a node environment!

const filename_match = {
    'Avatar_Gnd_': 'Download Ground',
    'Avatar_Sky_': 'Download Sky',
    'AvatarMini_Sky': 'Download Mini Sky',
    'AvatarMini_Gnd': 'Download Mini Ground',
    'AvatarSE_Gnd': 'Download VRX',
    'AvatarSE_Sky': 'Download ???',
    'Avatar': 'Download'
}

const fs = require('fs');
const crypto = require('crypto');

// get input version
const version = process.argv[2];

// scan the directory
const directory = `./_firmwares/${version}`;
const files = fs.readdirSync(directory);

const output = {
    badges: [
        "official",
        "CHANGE ME"
    ],
    date: new Date().toISOString().split('T')[0],
    version: version,
    notes: "CHANGE ME",
    downloads: []
}

// calculate hashes
for (const file of files.reverse()) {
    const data = fs.readFileSync(`${directory}/${file}`);
    const hash = crypto.createHash('sha1').update(data).digest('hex').toUpperCase();

    // find the first match in filename_match
    let button_text = 'Download';
    for (const key in filename_match) {
        if (file.startsWith(key)) {
            button_text = filename_match[key];
            break;
        }
    }

    output.downloads.push({
        btn: button_text,
        sha1: hash,
        url: `/dl/${version}/${file}`,
        filename: file
    });
}

console.log(JSON.stringify(output, null, 4));