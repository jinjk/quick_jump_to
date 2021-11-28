var jiraBaseURL = 'https://product-jira.ariba.com/browse/';
var globalConfig = [];
var globalJiraSiteUrl;

chrome.commands.onCommand.addListener((command) => {
  console.log(`command: ${command}`);
  if (command == 'goto-new-page') {
    var str = readClipboard();
    console.log(`clipboard: ${str}`);
    if (str) {
      str = str.trim();
      for (item of globalConfig) {
        let re = new Regexp(item.regex);
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
      globalConfig = JSON.parse(items.configDoc);
      globalJiraSiteUrl = getJiraSiteUrl();
  });
}
load_options();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    load_options();
  }
});