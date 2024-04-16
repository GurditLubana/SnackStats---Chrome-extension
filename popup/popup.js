
document.getElementById('uber').addEventListener('click', function() {
    chrome.runtime.sendMessage({action : 'uber'});
  });
  

  document.getElementById('skip').addEventListener('click', function() {
    chrome.runtime.sendMessage({action : 'skip'});
  });

  document.getElementById('doordash').addEventListener('click', function() {
    chrome.runtime.sendMessage({action : 'doordash'});
  });