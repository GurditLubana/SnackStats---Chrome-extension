chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.buttonClicked) {
    console.log("Button was clicked in popup");
    // Perform actions or trigger events in response

    function injectedFunction(color) {
      document.body.style.backgroundColor = color;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: injectedFunction,
        args: ["orange"],
      });
    });
  }
  sendResponse({ acknowledged: "Button click acknowledged" });
});
