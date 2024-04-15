chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.buttonClicked) {
      console.log("Button was clicked in popup");
  
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const tabId = tabs[0].id;
        chrome.tabs.get(tabId, function(tab) {
          if (tab.url.includes("ubereats.com/ca/orders")) {
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              files: ['scripts/content.js']
            });
          } else {
            chrome.tabs.update(tabId, { url: "https://www.ubereats.com/ca/orders" });
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
              if (changeInfo.status === 'complete' && tab.url.includes("ubereats.com/ca/orders")) {
                chrome.scripting.executeScript({
                  target: { tabId: tabId },
                  files: ['scripts/content.js']
                });
                chrome.tabs.onUpdated.removeListener(listener); 
              }
            });
          }
        });
      });
    }
    else if(message.action=== "skip"){

      console.log("Clicked on Skip");
  
      chrome.tabs.create({ url: "https://www.skipthedishes.com/user/account/orders" }, function (newTab) {
        setTimeout(() => {
          chrome.scripting.executeScript(
            {
              target: { tabId: newTab.id },
              files: ["scripts/skipScripts.js"],
            }
          );
        }, 2000); 
      });
    }
    sendResponse({ acknowledged: "Button click acknowledged." });
  });
  