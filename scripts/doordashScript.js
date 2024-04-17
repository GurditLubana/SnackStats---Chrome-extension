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
  try {
    await expandOrdersList();
    const orderListJson = fetchOrdersData();
    console.log(orderListJson);
  } catch (error) {
    console.error("Error calculating expenditure:", error);
  }
}

async function expandOrdersList() {
  while (document.querySelector(".iMIGfw")) {
    console.log("Clicking on 'load more' button.");
    document.querySelector(".iMIGfw").click();
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  console.log("Finished expanding the orders list.");
}

function fetchOrdersData() {
  const mainContent = document.querySelector(
    '.StackChildren__StyledStackChildren-sc-1tveqpz-0[data-testid="OrdersV2"]'
  );
  if (!mainContent) {
    throw new Error("Main content not found.");
  }

  const ordersList = mainContent.querySelector(
    ".StackChildren__StyledStackChildren-sc-1tveqpz-0"
  );
  const orderListJson = {
    totalAmountSpent: 0,
    mostAmountSpent: { restaurant: [], amountSpent: 0 },
  };

  ordersList.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const restaurantName =
        node
          .querySelector(".Text-sc-16fu6d-0.sc-7ff7002-1.NCYFa")
          ?.textContent.trim() || "No restaurant name found";
      const amountText = node
        .querySelector(".Text-sc-16fu6d-0.eHhTon")
        ?.textContent.split(" • ")[1]
        .split("$")[1];
      const amount = parseFloat(amountText) || 0.0;
      if (restaurantName !== "No restaurant name found") {
        updateOrderListJson(orderListJson, restaurantName, amount);
      }
    }
  });

  return orderListJson;
}

function updateOrderListJson(orderListJson, restaurantName, amount) {
  if (!orderListJson[restaurantName]) {
    orderListJson[restaurantName] = { visits: 1, totalSpent: amount };
  } else {
    orderListJson[restaurantName].visits++;
    orderListJson[restaurantName].totalSpent += amount;
  }

  orderListJson.totalAmountSpent += amount;
  updateMostSpent(
    orderListJson,
    restaurantName,
    orderListJson[restaurantName].totalSpent
  );
}

function updateMostSpent(orderListJson, restaurantName, totalSpent) {
  const mostSpent = orderListJson.mostAmountSpent;
  if (totalSpent > mostSpent.amountSpent) {
    mostSpent.amountSpent = totalSpent;
    mostSpent.restaurant = [restaurantName];
  } else if (totalSpent === mostSpent.amountSpent) {
    if (!mostSpent.restaurant.includes(restaurantName)) {
      mostSpent.restaurant.push(restaurantName);
    }
  }
}
