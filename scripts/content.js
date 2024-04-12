async function expandAllListItems() {
    let orderList = document.getElementById("main-content");
    if (!orderList) {
      console.log("No id found.");
      return;
    }
  
    let expandListBtn = (orderList.firstChild).lastChild; 
    while (expandListBtn && expandListBtn.nodeName === "BUTTON") {
      expandListBtn.click();
      await new Promise(resolve => setTimeout(resolve, 2500)); 
      expandListBtn = (orderList.firstChild).lastChild; 
    }
    console.log("Finished expanding all items.");
  }
  

  if (document.readyState === 'complete') {
    console.log("Hello world")
    expandAllListItems();
  } 
  else {
    window.addEventListener('load', expandAllListItems);
  }
  
  