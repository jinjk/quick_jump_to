import {util} from './util.js';

var globalConfig = [];

chrome.commands.onCommand.addListener((command) => {
  console.log(`command: ${command}`);
  if (command == 'goto-new-page') {
    var str = readClipboard();
    console.log(`clipboard: ${str}`);
    if (str) {
      str = str.trim();
      for (let item of globalConfig) {
        let re = new RegExp(item.regex);
        if (re.test(str)) {
          let newURL = item.url + str;
          chrome.tabs.create({ url: newURL });
        }
      }
    }
  }
});

function readClipboard() {
  var result = '';
  var sandbox = document.getElementById('sandbox');
  sandbox.value = '';
  sandbox.select();
  if (document.execCommand('paste')) {
      result = sandbox.value;
      console.log('got value from sandbox: ' + result);
  }
  sandbox.value = '';
  return result;
}


// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function load_options() {
  // Use default value jiraSiteUrl = 'red' and configDoc = true.
  chrome.storage.sync.get({
      configDoc: '[]'
  }, function (items) {
      globalConfig = util.parseConfig(items.configDoc);
  });
}
load_options();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    load_options();
  }
});