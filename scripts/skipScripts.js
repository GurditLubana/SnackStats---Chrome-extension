if (document.readyState === "complete") {
  console.log("i am ready now");
  calculateExpenditure();
} else {
  window.addEventListener("load", () => {
    console.log("i am still loading... ");
    calculateExpenditure();
  });
}

async function calculateExpenditure() {

  const mainElement = document.querySelector(".styles__Wrapper-sc-1kbgjlb-0");
  if (mainElement) {

    while (mainElement.querySelector(".MuiButtonBase-root-330")) {
      console.log("Clicking on 'load more' button.");
      mainElement.querySelector(".MuiButtonBase-root-330").click();
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    console.log("Finished expanding the orders list.");
  
    waitForContent(mainElement, processOrderList);
    
  }


}

function waitForContent(mainElement, callback) {
  setTimeout(() => {
    const orderList = mainElement.querySelector(
      '.styles__OrderList-sc-gks0ae-0[role="list"]'
    );
    if (!orderList) {
      console.error("Order list not found.");
      return;
    }

    callback(orderList);
  }, 1000); 
}

function processOrderList(orderList) {
  let orderListJson = {
    totalAmountSpent: 0,
    mostAmountSpent: { restaurant: [], amountSpent: 0 },
  };

  orderList.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const restaurantName = getRestaurantName(node);
      const amount = getAmount(node);
      if (restaurantName !== "No restaurant name found") {
        updateOrderList(orderListJson, restaurantName, amount);
      }
    }
  });

  console.log(orderListJson);
}

function getRestaurantName(node) {
  const restaurantNode = node.querySelector(
    ".styles__RestaurantTitle-sc-282i19-13"
  );
  return restaurantNode
    ? restaurantNode.textContent
    : "No restaurant name found";
}

function getAmount(node) {
  const amountNode = node.querySelector(".styles__Total-sc-282i19-6");
  if (amountNode && amountNode.childNodes[1]) {
    return (
      parseFloat(amountNode.childNodes[1].textContent.split("$")[1]) || 0.0
    );
  }
  return 0.0;
}

function updateOrderList(orderListJson, restaurantName, amount) {
  const entry = orderListJson[restaurantName] || { visits: 0, totalSpent: 0 };

  entry.visits++;
  entry.totalSpent += amount;
  orderListJson[restaurantName] = entry;
  orderListJson.totalAmountSpent += amount;

  updateMostSpent(orderListJson, restaurantName, entry.totalSpent);
}

function updateMostSpent(orderListJson, restaurantName, totalSpent) {
  const mostSpent = orderListJson.mostAmountSpent;

  if (totalSpent > mostSpent.amountSpent) {
    mostSpent.amountSpent = totalSpent;
    mostSpent.restaurant = [restaurantName];
  } else if (
    totalSpent === mostSpent.amountSpent &&
    !mostSpent.restaurant.includes(restaurantName)
  ) {
    mostSpent.restaurant.push(restaurantName);
  }
}

