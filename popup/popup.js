
document.getElementById('clickme').addEventListener('click', function() {
    chrome.runtime.sendMessage({buttonClicked: true}, function(response) {
      console.log('Received response:', response);
    });
  });
  

  document.getElementById('skip').addEventListener('click', function() {
    chrome.runtime.sendMessage({action : 'skip'});
  });