if (document.readyState === 'complete') {
    console.log("i am ready now");
    expandScreen();
  } 
  else {
    window.addEventListener('load', ()=>{
        console.log("i am still loading... ");
        expandScreen();

    });
  }

  function expandScreen(){

    var mainElement = document.querySelector('.styles__Wrapper-sc-1kbgjlb-0');
    var button = mainElement.querySelector('.MuiButtonBase-root-330');
   
    if(button){button.click();}
    
    setTimeout(()=>{

      var orderList = mainElement.querySelector('.styles__OrderList-sc-gks0ae-0[role="list"]');
      let orderListJson = {'totalAmountSpent':0, 'mostAmountSpent': {'restaurant':[], 'amountSpent':0}}
      orderList.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) { 
          var restaurantName = node.querySelector('.styles__RestaurantTitle-sc-282i19-13'); 
          restaurantName = restaurantName ? restaurantName.textContent : 'No restaurant name found';
          var amount = (node.querySelector('.styles__Total-sc-282i19-6'));
          amount = amount? parseFloat(((amount.childNodes[1]).textContent).split("$")[1]) : 0.00

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
        
      });
      console.log(orderListJson)

    },1000)

  }
