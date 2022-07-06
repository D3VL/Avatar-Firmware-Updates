const BADGES = {
    "latest": `<span class="badge rounded-pill bg-primary">Latest</span>`,
    "official": `<span class="badge rounded-pill bg-success">Official</span>`,
    "custom": `<span class="badge rounded-pill bg-warning">Custom</span>`,
    "unknown": `<span class="badge rounded-pill bg-danger">Unknown Origin</span>`
}

const firmwares = []

fetch('firmwares.json').then(res => res.json()).then(firmwares => {
    firmwares.reverse().forEach(firmware => {

        // Look, i know, but this is a quick 1am hack together. PR's accepted :)
        const template = `
        <div class="card p-3 mb-3">
            <div class="row firmware-item">
                <div class="col-12 col-lg-8 mb-3 mb-lg-0">
                    <h2 class="mb-0">${firmware.version}</h2>
                    <small>Released: <b>${new Date(firmware.date).toLocaleDateString()}</b></small>

                    <p>${firmware.notes}</p>

                    ${firmware.badges.map(type => BADGES[type]).join("\n")}
                </div>

                <div class="col-12 col-lg-4">
                    <div class="row text-center">
                        <div class="col-12 mb-2">
                            <a target="_blank" download="Avatar_Sky_${firmware.sky_version}.img" href="firmwares/${firmware.version}/Avatar_Sky_${firmware.sky_version}.img" class="btn btn-primary w-100">Download Sky</a>
                            <small class="sha-text">${firmware.sky_sha1}</small>
                        </div>
                        <div class="col-12">
                            <a target="_blank" download="Avatar_Gnd_${firmware.ground_version}.img" href="firmwares/${firmware.version}/Avatar_Gnd_${firmware.sky_version}.img" class="btn btn-primary w-100">Download Ground</a>
                            <small class="sha-text">${firmware.ground_sha1}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        document.getElementById("firmwares").insertAdjacentHTML("beforeend", template);

        firmwares.push({ ...firmware, template });
    });

    // show the user a great music video incase they click on the hash, but only 10% of the time
    [].forEach.call(document.getElementsByClassName('sha-text'), function (element) {
        element.addEventListener('click', () => {
            // if chance of 10%
            if (Math.random() < 0.1) {
                window.location = `https://www.youtube.com/watch?v=p80-AOQ_tas`;
            }
        })
    });

})
