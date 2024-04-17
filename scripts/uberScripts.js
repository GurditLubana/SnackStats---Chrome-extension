
if (document.readyState === "complete") {
  calculateExpenditure();
} else {
  window.addEventListener("load", calculateExpenditure);
}





async function calculateExpenditure() {
  const mainContent = document.getElementById("main-content");
  if (mainContent) {
    const orderList = mainContent.firstChild;
    await expandOrderList(orderList);

    const orderListJson = {
      totalAmountSpent: 0,
      mostAmountSpent: { restaurant: [], amountSpent: 0 },
    };

    orderList.childNodes.forEach((node) => {
      console.log("inside of loop");

      if (node.className === "al") {
        processDataNode(node, orderListJson);
      }
    });
    console.log(orderListJson);
  }
}




async function expandOrderList(orderList) {
  let expandListBtn = orderList.lastChild;
  while (expandListBtn && expandListBtn.nodeName === "BUTTON") {
    expandListBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 2500));
    expandListBtn = orderList.lastChild;
  }
  console.log("Finished expanding all items.");
}




function processDataNode(node, orderListJson) {
  const orderInfo = node.children[2].children[0].children[0].children[0];
  const restaurantName = orderInfo.children[0].children[0].textContent.trim();
  const amountString = orderInfo.children[1].children[0].firstChild.textContent;
  let amount = amountString.split("$")[1]
    ? parseFloat(amountString.split("$")[1].trim())
    : 0.0;

  console.log(restaurantName, amount);

  updateOrderStats(restaurantName, amount, orderListJson);
}





function updateOrderStats(restaurantName, amount, orderListJson) {
  if (!orderListJson[restaurantName]) {
    orderListJson[restaurantName] = { visits: 1, totalSpent: amount };
  } else {
    orderListJson[restaurantName].visits++;
    orderListJson[restaurantName].totalSpent += amount;
  }

  orderListJson.totalAmountSpent += amount;

  updateMostSpent(restaurantName, amount, orderListJson);
}




function updateMostSpent(restaurantName, amount, orderListJson) {
  const mostSpent = orderListJson.mostAmountSpent;
  const totalAmount = orderListJson[restaurantName].totalSpent;

  if (totalAmount > mostSpent.amountSpent) {
    mostSpent.amountSpent = totalAmount;
    mostSpent.restaurant = [restaurantName];
  } else if (
    totalAmount === mostSpent.amountSpent &&
    !mostSpent.restaurant.includes(restaurantName)
  ) {
    mostSpent.restaurant.push(restaurantName);
  }
}


