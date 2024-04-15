
document.getElementById('clickme').addEventListener('click', function() {
    chrome.runtime.sendMessage({action : 'uber'});
  });
  

  document.getElementById('skip').addEventListener('click', function() {
    chrome.runtime.sendMessage({action : 'skip'});
  });