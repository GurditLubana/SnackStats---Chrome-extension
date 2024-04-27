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

    else if(message.action === "doordash"){

      console.log("Clicked on Doordash");
  
      chrome.tabs.create({ url: "https://www.doordash.com/orders/" }, function (newTab) {
        setTimeout(() => {
          chrome.scripting.executeScript(
            {
              target: { tabId: newTab.id },
              files: ["scripts/doordashScript.js"],
            }
          );
        }, 2000); 
      });
    }

    else if(message.action === 'dataFetched'){
      
        const orderHistoryStat = message.orderHistoryStat;
        console.log(orderHistoryStat);
        const statsDisplayScreen = "http://localhost:3000/";
  
    chrome.tabs.query({ url: statsDisplayScreen }, function (tabs) {
      if (tabs.length > 0) {

        let existingTab = tabs[0];
        chrome.tabs.update(existingTab.id, { active: true }); 
      } else {

        chrome.tabs.create({ url: statsDisplayScreen }, function (newTab) {
          setTimeout(() => {
            chrome.scripting.executeScript(
              {
                target: { tabId: newTab.id },
                files: ["scripts/snackStatScript.js"],
              },
              () => {
                chrome.tabs.sendMessage(newTab.id, {
                  action: "fetchedData",
                  fetchedData: orderHistoryStat,
                });
              }
            );
          }, 1000);
        });
      }
    });

    }
    sendResponse({ acknowledged: "Button click acknowledged." });
  });
  
  