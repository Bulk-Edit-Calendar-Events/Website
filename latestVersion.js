var latestVersionData = {
    'latestVersion': '6.4',
    'releaseNotes': 'This version includes a variety of bug fixes including:\r\n- Various crash/startup/file read issues\r\n- Other minor tweaks & stability improvements\r\n\r\nAs always, please report any found issues by clicking the bug icon in the program or by sending an email to support@bulkeditcalendarevents.com',
    'updateWin': {
    'url': 'https://bulk-edit-calendar-events.s3-us-west-2.amazonaws.com/Bulk%20Edit%20Calendar%20Events%20setup%20%5B6.4%5D.exe',
    'size': 37500000
    },
    'updateMac': {
    'url': 'https://bulk-edit-calendar-events.s3-us-west-2.amazonaws.com/Bulk%20Edit%20Calendar%20Events%20%5B6.4%5D.dmg',
    'size': 37500000
    }
};

// Points the ".latestMacOS" buttons at the latest .dmg. Once an Apple Silicon build is published (updateMacArm64):
// - showBothArchitectures (downloads page): each button is split into "Apple Silicon" + "Intel" buttons
// - otherwise: the button links to the build matching the visitor's Mac (see detectMacArchitecture)
function setMacDownloadButtons(showBothArchitectures) {
    // The Intel build is the safe default: it also runs on Apple Silicon (via Rosetta), and the app's updater
    // moves those users to the native build. The Apple Silicon build won't launch on an Intel Mac
    $(".latestMacOS").attr("href", latestVersionData["updateMac"]["url"]);

    if (!latestVersionData["updateMacArm64"]) {
        return;
    }

    if (showBothArchitectures) {
        $(".latestMacOS").each(function () {
            var armButton = $(this).clone().removeClass("latestMacOS").attr("href", latestVersionData["updateMacArm64"]["url"]);
            armButton.find("span").text("Download for Mac (Apple Silicon)");
            $(this).find("span").text("Download for Mac (Intel)");
            $(this).before(armButton);
        });
    }
    else {
        detectMacArchitecture(function (architecture) {
            if (architecture === "arm") {
                $(".latestMacOS").attr("href", latestVersionData["updateMacArm64"]["url"]);
            }
        });
    }
}

// Calls back with "arm", "intel", or "unknown". Browsers don't expose the CPU directly (and every Mac browser's user agent
// says "Intel Mac OS X"), so this uses what's available:
// 1. Chromium browsers (Chrome, Edge, etc) report the architecture via User-Agent Client Hints
// 2. Otherwise, the GPU name from WebGL ("Apple M1", "Intel Iris", "AMD Radeon", etc). Safari masks this as "Apple GPU"
//    on every Mac, so Safari is usually "unknown"
function detectMacArchitecture(callback) {
    if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
        navigator.userAgentData.getHighEntropyValues(["architecture"]).then(function (values) {
            callback(values.architecture === "arm" ? "arm" : values.architecture === "x86" ? "intel" : detectMacArchitectureFromGpu());
        }, function () {
            callback(detectMacArchitectureFromGpu());
        });
    }
    else {
        callback(detectMacArchitectureFromGpu());
    }
}

function detectMacArchitectureFromGpu() {
    try {
        var gl = document.createElement("canvas").getContext("webgl");
        if (!gl) {
            return "unknown";
        }

        var debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        var renderer = String(debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));

        if (/Apple M\d/i.test(renderer)) {
            return "arm";
        }
        if (/Intel|AMD|Radeon|NVIDIA|GeForce/i.test(renderer)) {
            return "intel";
        }
    }
    catch (e) {
    }

    return "unknown";
}
