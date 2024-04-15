chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "uber") {

      console.log("Clicked on Uber");
  
      chrome.tabs.create({ url: "https://www.ubereats.com/ca/orders" }, function (newTab) {
        setTimeout(() => {
          chrome.scripting.executeScript(
            {
              target: { tabId: newTab.id },
              files: ["scripts/uberScripts.js"],
            }
          );
        }, 2000); 
      });
    }

    else if(message.action === "skip"){

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
  