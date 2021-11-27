var jiraBaseURL = 'https://product-jira.ariba.com/browse/';

chrome.commands.onCommand.addListener((command) => {
  console.log(`command: ${command}`);
  if (command == 'goto-new-page') {
    var str = readClipboard();
    console.log(`clipboard: ${str}`);
    if (str) {
      str = str.trim();
      if (/^\w+-\w+$/.test(str)) {
        let newURL = jiraBaseURL + str;
        chrome.tabs.create({ url: newURL });
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