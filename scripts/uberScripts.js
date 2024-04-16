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
    console.log("\n\nFinished expanding all items.");
    const pastOrdersList = orderList.firstChild;
    let orderListJson = {'totalAmountSpent':0, 'mostAmountSpent': {'restaurant':[], 'amountSpent':0}}

    for (var i in pastOrdersList.childNodes){
      if ((pastOrdersList.childNodes[i]).className === "al"){
        
        var orderInfo = (pastOrdersList.childNodes[i]).children[2].children[0].children[0].children[0];
        var restaurantName = orderInfo.children[0].children[0].innerHTML.trim();
        var amount = (orderInfo.children[1].children[0].firstChild.textContent).split("$")[1];

        amount = amount? parseFloat(amount.trim()): 0.00;
        
        if(!(restaurantName in orderListJson)){

          orderListJson[restaurantName] = [1, amount];
          orderListJson['totalAmountSpent']+= amount;

          if(amount > orderListJson['mostAmountSpent']['amountSpent']){
            orderListJson['mostAmountSpent']['amountSpent'] = amount;
            orderListJson['mostAmountSpent']['restaurant'] = [];
            (orderListJson['mostAmountSpent']['restaurant']).push(restaurantName);
          }
          else if(amount === orderListJson['mostAmountSpent']['amountSpent']){
            (orderListJson['mostAmountSpent']['restaurant']).push(restaurantName);
          }
          
        }
        else{
          var numVisited = (orderListJson[restaurantName])[0] + 1;
          var totalAmount = (orderListJson[restaurantName])[1] + amount;
          orderListJson[restaurantName] = [numVisited, totalAmount]
          orderListJson['totalAmountSpent']+= amount;

          if(totalAmount > orderListJson['mostAmountSpent']['amountSpent']){
            orderListJson['mostAmountSpent']['amountSpent'] = totalAmount;
            orderListJson['mostAmountSpent']['restaurant'] = [];
            (orderListJson['mostAmountSpent']['restaurant']).push(restaurantName);
          }
          else if(totalAmount === orderListJson['mostAmountSpent']['amountSpent']){
            (orderListJson['mostAmountSpent']['restaurant']).push(restaurantName);
          }
          



        }

       
      }
    }
    console.log(orderListJson);
  }
  

  if (document.readyState === 'complete') {
    expandAllListItems();
  } 
  else {
    window.addEventListener('load', expandAllListItems);
  }
  
  