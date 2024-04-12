
document.getElementById('clickme').addEventListener('click', function() {
    chrome.runtime.sendMessage({buttonClicked: true}, function(response) {
      console.log('Received response:', response);
    });
  });
  