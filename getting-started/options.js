import {util} from './util.js';

var globalConfig = [];
var globalJiraSiteUrl = '';

function getJiraSiteUrl() {
    let jiraSiteUrl = '';
    if (globalConfig.length > 0) {
        let item = globalConfig[0];
        jiraSiteUrl = item.url;
    }
    return jiraSiteUrl;
}

function updateJiraSiteUrl(jiraUrl) {
    if (globalConfig.length > 0) {
        let item = globalConfig[0];
        item.url = jiraUrl;
        found = true;
    }
    else {
        let item = {
            index: 1,
            url: jiraUrl,
            regex: '\\w+-\\w+'
        }
        globalConfig.push(item);
    }
}

// Saves options to chrome.storage
function save_options() {
    var jiraSiteUrl = document.getElementById('input_site_url').value;
    var jsonStr = document.getElementById('input_config').value;
    var status = document.getElementById('status');
    status.textContent = '';
    if (jsonStr) {
        try {
            globalConfig = util.parseConfig(jsonStr);
        }
        catch (e) {
            status.setAttribute("messageType", "error");
            status.textContent = "Error in json config, please correct. (regex uses double backslash for '\\')";
            return;
        }
    }
    if (jiraSiteUrl != globalJiraSiteUrl) {
        updateJiraSiteUrl(jiraSiteUrl);
        globalJiraSiteUrl = jiraSiteUrl;
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
        status.setAttribute("messageType", "info");
        status.textContent = 'Options saved.';
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value jiraSiteUrl = 'red' and configDoc = true.
    chrome.storage.sync.get({
        configDoc: '[]'
    }, function (items) {
        globalConfig = util.parseConfig(items.configDoc);
        globalJiraSiteUrl = getJiraSiteUrl();
        document.getElementById('input_site_url').value = globalJiraSiteUrl;
        document.getElementById('input_config').value = items.configDoc;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
