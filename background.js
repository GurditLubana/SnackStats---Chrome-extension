chrome.runtime.onMessage.addListener(function (message, sender) {

  function openTabAndMonitor(url, scriptFile) {
    chrome.tabs.create({ url: url }, function (newTab) {
      function checkForLoginPage(tabId, changeInfo, tab) {
        if (tabId === newTab.id && changeInfo.status === "complete") {
          if (tab.url.includes("auth")) {
            chrome.notifications.create({
              type: "basic",
              iconUrl: "Images/logo48.png",
              title: "Login Required",
              message: "Please log in to continue.",
            });

            chrome.tabs.onUpdated.removeListener(checkForLoginPage);
          } else {
            setTimeout(() => {
              chrome.scripting.executeScript({
                target: { tabId: newTab.id },
                files: [scriptFile],
              });
            }, 1000);

            chrome.tabs.onUpdated.removeListener(checkForLoginPage);
          }
        }
      }
      chrome.tabs.onUpdated.addListener(checkForLoginPage);
    });
  }

  function executeContentScript(tabId) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["scripts/fetchDoordashYear.js"]
    }, () => {
      // Listener to receive data from fetchDoordashYear.js
      chrome.runtime.onMessage.addListener(function handler(response) {
        if (response.action === "yearExtracted") {
          // Send year data back to original tab
          chrome.tabs.sendMessage(sender.tab.id, {
            action: "yearReceived",
            year: response.year
          });

          // Remove listener and close the background tab
          chrome.runtime.onMessage.removeListener(handler);
          chrome.tabs.remove(newTab.id);
        }
      });
    });
  }


  if (message.action === "uber") {
    console.log("Clicked on Uber");
    openTabAndMonitor(
      "https://www.ubereats.com/ca/orders",
      "scripts/uberScripts.js"
    );
  } else if (message.action === "skip") {
    console.log("Clicked on Skip");

    chrome.tabs.create(
      { url: "https://www.skipthedishes.com/user/account/orders" },
      function (newTab) {
        setTimeout(() => {
          chrome.scripting.executeScript({
            target: { tabId: newTab.id },
            files: ["scripts/skipScripts.js"],
          });
        }, 1000);
      }
    );
  } else if (message.action === "doordash") {
    console.log("Clicked on Doordash");

    openTabAndMonitor(
      "https://www.doordash.com/orders/",
      "scripts/doordashScript.js"
    );
  } else if (message.action === "dataFetched") {
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
    
});
