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
  




// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   if (message.buttonClicked) {
//     console.log("Button was clicked in popup");

//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       chrome.scripting.executeScript({
//         target: { tabId: tabs[0].id },
//         func: calculateStats,
//       });
//     });

//     function calculateStats() {
//       const currentLink = window.location.href;
//       console.log("current link: ", currentLink);

//     //   calculateDoordashStats();
//     //   calculateSkiptheDishesStats();
//       calculateUberEatsStats();

//       function calculateDoordashStats() {
//         const doordashUrl = "https://www.doordash.com/orders/";
//         window.open(doordashUrl, "_blank").focus();
//         if (window.location.href === doordashUrl) {
//           console.log("Yes logged in to doordash");
//         } else {
//           console.log("not doordash.");
//           console.log(window.location.href);
//         }
//       }

//       async function calculateDoordashStats() {
//         const doordashUrl = "https://www.doordash.com/orders/";

//       }

//       function calculateSkiptheDishesStats() {
//         const skipthedishesUrl =
//           "https://www.skipthedishes.com/user/account/orders";
//           window.location.href = skipthedishesUrl;

       
//       }

//     async function calculateUberEatsStats() {
//         const ubereatsUrl = "https://www.ubereats.com/ca/orders";

//         if (window.location.href !== ubereatsUrl) {
//             window.location.href = ubereatsUrl;
//             chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//                 console.log("This is info: ",tabId, changeInfo, tab)
//              });
//         }
    
//         async function expandAllListItems() {
//             let orderList = document.getElementById("main-content");
//             if (!orderList) {
//                 console.log("No id found.");
//                 return;
//             }
    
//             let expandListBtn = ((orderList.firstChild).lastChild);  

//             while (expandListBtn && expandListBtn.nodeName === "BUTTON") {
//                 expandListBtn.click();
                
//                 await new Promise(resolve => setTimeout(resolve, 2500)); 
//                 expandListBtn = ((orderList.firstChild).lastChild);  
//             }
//             console.log("Finished expanding all items.");
//         }
    
//         await expandAllListItems();
//     }
          
//     }
//   }
//   sendResponse({ acknowledged: "Button click acknowledged." });
// });
