var globalConfig = [];
var globalJiraSiteUrl = '';

function getJiraSiteUrl() {
    jiraSiteUrl = '';
    for (item of globalConfig) {
        if (item.index == 1) {
            jiraSiteUrl = item.url;
            break;
        }
    }
    return jiraSiteUrl;
}

function updateJiraSiteUrl(jiraUrl) {
    found = false;
    for (item of globalConfig) {
        if (item.index == 1) {
            item.url = jiraUrl;
            found = true;
            break;
        }
    }

    if (!found) {
        item = {
            index: 1,
            url: jiraUrl,
            regex: '^.*$'
        }
        globalConfig.push(item);
    }
}

// Saves options to chrome.storage
function save_options() {
    var jiraSiteUrl = document.getElementById('input_site_url').value;
    var jsonStr = document.getElementById('input_config').value;
    if (jsonStr) {
        try {
            globalConfig = JSON.parse(jsonStr);
        }
        catch (e) {
            var status = document.getElementById('status');
            status.textContent = 'Error in json config, please correct.';
            setTimeout(function () {
                status.textContent = '';
            }, 750);
            return;
        }
    }
    if (jiraSiteUrl != globalJiraSiteUrl) {
        updateJiraSiteUrl(jiraSiteUrl);
    }
    else {
        globalJiraSiteUrl = getJiraSiteUrl();
    }
    jsonStr = JSON.stringify(globalConfig, null, 2);
    document.getElementById('input_site_url').value = globalJiraSiteUrl;
    document.getElementById('input_config').value = jsonStr;
    chrome.storage.sync.set({
        configDoc: jsonStr
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value jiraSiteUrl = 'red' and configDoc = true.
    chrome.storage.sync.get({
        configDoc: '[]'
    }, function (items) {
        globalConfig = JSON.parse(items.configDoc);
        globalJiraSiteUrl = getJiraSiteUrl();
        document.getElementById('input_site_url').value = globalJiraSiteUrl;
        document.getElementById('input_config').value = items.configDoc;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
