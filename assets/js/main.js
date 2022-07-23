const BADGES = {
    "latest": `<span class="badge rounded-pill bg-primary">Latest</span>`,
    "official": `<span class="badge rounded-pill bg-success">Official</span>`,
    "custom": `<span class="badge rounded-pill bg-warning">Custom</span>`,
    "unknown": `<span class="badge rounded-pill bg-danger">Unknown Origin</span>`
}

let firmwares = [];
let filtered_firmwares = [];
let override_fw_version = false;

fetch('firmwares.json?t=' + Date.now()).then(res => res.json()).then(api_firmwares => {
    firmwares = api_firmwares;
    filtered_firmwares = api_firmwares;

    displayFirmwares(api_firmwares);
})

// on #isDowngrading checked, generate a random firmware version as the fake name
document.getElementById("isDowngrading").addEventListener("change", () => {
    if (document.getElementById("isDowngrading").checked) {
        override_fw_version = true;
        displayFirmwares(filtered_firmwares);
    } else {
        override_fw_version = false;
        displayFirmwares(filtered_firmwares);
    }
});


function updateFilters() {
    let filtered = firmwares;

    if (document.getElementById("tag").value !== "*") {
        filtered = filtered.filter(firmware => firmware.badges.includes(document.getElementById("tag").value));
    }
    if (document.getElementById("version_major").value !== "*") {
        filtered = filtered.filter(firmware => firmware.version.split(".")[0] === document.getElementById("version_major").value);
    }
    if (document.getElementById("version_minor").value !== "*") {
        filtered = filtered.filter(firmware => firmware.version.split(".")[1] === document.getElementById("version_minor").value);
    }
    if (document.getElementById("version_patch").value !== "*") {
        filtered = filtered.filter(firmware => firmware.version.split(".")[2] === document.getElementById("version_patch").value);
    }

    filtered_firmwares = filtered;
}

// on tag, version_major, version_minor, version_patch change, update the filtered firmwares
document.getElementById("tag").addEventListener("change", () => {
    updateFilters();
    displayFirmwares(filtered_firmwares);
})
document.getElementById("version_major").addEventListener("change", () => {
    updateFilters();
    displayFirmwares(filtered_firmwares);
})
document.getElementById("version_minor").addEventListener("change", () => {
    updateFilters();
    displayFirmwares(filtered_firmwares);
})
document.getElementById("version_patch").addEventListener("change", () => {
    updateFilters();
    displayFirmwares(filtered_firmwares);
})



function rebindEventListeners() {
    // show the user a great music video incase they click on the hash, but only 10% of the time
    [].forEach.call(document.getElementsByClassName('sha-text'), function (element) {
        // clear event listeners to prevent multiple listeners
        element.removeEventListener('click', function () { });
        element.addEventListener('click', () => {
            // if chance of 10%
            if (Math.random() < 0.1) {
                window.location = `https://www.youtube.com/watch?v=p80-AOQ_tas`;
            }
        })
    });
}

function displayFirmwares(firmwares) {
    // empty the table
    document.getElementById("firmwares").innerHTML = "";

    [...firmwares].reverse().forEach(firmware => {

        if (override_fw_version) {
            override_fw_version = [90, Math.floor(Math.random() * 100), 5].join(".")
        }

        // Look, i know, but this is a quick 1am hack together. PR's accepted :)
        const template = `
        <div class="card p-3 mb-3">
            <div class="row firmware-item">
                <div class="col-12 col-lg-8 mb-3 mb-lg-0">
                    <h2 class="mb-0">${firmware.version} </h2>
                    ${override_fw_version ? '<small>Downgrade as <b>' + override_fw_version + '</b></small><br>' : ''}
                    <small>Released: <b>${new Date(firmware.date).toLocaleDateString()}</b></small>

                    <p>${firmware.notes}</p>

                    ${firmware.badges.map(type => BADGES[type]).join("\n")}
                </div>

                <div class="col-12 col-lg-4">
                    <div class="row text-center">
                        <div class="col-12 mb-2">
                            <a target="_blank" download="Avatar_Sky_${override_fw_version ? override_fw_version : firmware.sky_version}.img" href="firmwares/${firmware.version}/Avatar_Sky_${firmware.sky_version}.img" class="btn btn-primary w-100">Download Sky</a>
                            <small class="sha-text">${firmware.sky_sha1}</small>
                        </div>
                        <div class="col-12">
                            <a target="_blank" download="Avatar_Gnd_${override_fw_version ? override_fw_version : firmware.ground_version}.img" href="firmwares/${firmware.version}/Avatar_Gnd_${firmware.sky_version}.img" class="btn btn-primary w-100">Download Ground</a>
                            <small class="sha-text">${firmware.ground_sha1}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        document.getElementById("firmwares").insertAdjacentHTML("beforeend", template);
    });

    // get all major, minor, and patch versions and put them in the dropdowns
    const all = `<option value="*">All</option>`

    const was_major = document.getElementById("version_major").value;
    const majors = [...new Set(firmwares.map(firmware => firmware.version.split(".")[0]))];

    const was_minor = document.getElementById("version_minor").value;
    const minors = [...new Set(firmwares.map(firmware => firmware.version.split(".")[1]))];

    const was_patch = document.getElementById("version_patch").value;
    const patches = [...new Set(firmwares.map(firmware => firmware.version.split(".")[2]))];

    document.getElementById("version_major").innerHTML = all + majors.map(major => `<option value="${major}">${major}</option>`).join("\n");
    document.getElementById("version_major").value = was_major;

    document.getElementById("version_minor").innerHTML = all + minors.map(minor => `<option value="${minor}">${minor}</option>`).join("\n");
    document.getElementById("version_minor").value = was_minor;

    document.getElementById("version_patch").innerHTML = all + patches.map(patch => `<option value="${patch}">${patch}</option>`).join("\n");
    document.getElementById("version_patch").value = was_patch;

    rebindEventListeners();
}

