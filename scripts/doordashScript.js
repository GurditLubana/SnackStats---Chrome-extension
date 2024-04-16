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
  await expandOrdersList();

  fetchOrdersData();
}

async function expandOrdersList() {
  var loadmoreBtn = document.querySelector(".iMIGfw");

  while (loadmoreBtn) {
    console.log("Clicking on load more btn.");
    loadmoreBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    loadmoreBtn = document.querySelector(".iMIGfw");
  }
  console.log("Finished expanding ");
}


function fetchOrdersData() {

  var mainContent = document.querySelector(
    '.StackChildren__StyledStackChildren-sc-1tveqpz-0[data-testid="OrdersV2"]'
  );
  var ordersList = mainContent.querySelector(
    ".StackChildren__StyledStackChildren-sc-1tveqpz-0"
  );
//   console.log(ordersList);

  let orderListJson = {
    totalAmountSpent: 0,
    mostAmountSpent: { restaurant: [], amountSpent: 0 },
  };
  ordersList.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {

      var restaurantName = node.querySelector(
        ".Text-sc-16fu6d-0.sc-7ff7002-1.NCYFa"
      );
      restaurantName = restaurantName
        ? restaurantName.textContent
        : "No restaurant name found";

      var amount = node.querySelector(".Text-sc-16fu6d-0.eHhTon");
      amount = amount ? parseFloat(amount.textContent.split(" • ")[1].split("$")[1]) : 0.0;
     
      insertData(restaurantName, orderListJson, amount);
    }
  });
  console.log(orderListJson);
}



function insertData(restaurantName, orderListJson, amount) {
  if (!(restaurantName in orderListJson)) {
    orderListJson[restaurantName] = [1, amount];
    orderListJson["totalAmountSpent"] += amount;

    if (amount > orderListJson["mostAmountSpent"]["amountSpent"]) {
      orderListJson["mostAmountSpent"]["amountSpent"] = amount;
      orderListJson["mostAmountSpent"]["restaurant"] = [];
      orderListJson["mostAmountSpent"]["restaurant"].push(restaurantName);
    } else if (amount === orderListJson["mostAmountSpent"]["amountSpent"]) {
      orderListJson["mostAmountSpent"]["restaurant"].push(restaurantName);
    }
  } else {
    var numVisited = orderListJson[restaurantName][0] + 1;
    var totalAmount = orderListJson[restaurantName][1] + amount;
    orderListJson[restaurantName] = [numVisited, totalAmount];
    orderListJson["totalAmountSpent"] += amount;

    if (totalAmount > orderListJson["mostAmountSpent"]["amountSpent"]) {
      orderListJson["mostAmountSpent"]["amountSpent"] = totalAmount;
      orderListJson["mostAmountSpent"]["restaurant"] = [];
      orderListJson["mostAmountSpent"]["restaurant"].push(restaurantName);
    } else if (
      totalAmount === orderListJson["mostAmountSpent"]["amountSpent"]
    ) {
      orderListJson["mostAmountSpent"]["restaurant"].push(restaurantName);
    }
  }
}
