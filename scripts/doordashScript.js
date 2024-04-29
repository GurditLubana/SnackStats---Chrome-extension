if (document.readyState === "complete") {
  console.log("Ready to Fetch the data.");
  calculateExpenditure();
} else {
  window.addEventListener("load", () => {
    console.log("Doordash not yet loaded completely.");
  });
}

async function calculateExpenditure() {
  try {
    await expandOrdersList();
    const orderListJson = fetchOrdersData();
    chrome.runtime.sendMessage({
      action: "dataFetched",
      orderHistoryStat: orderListJson,
    });
    console.log(orderListJson);
  } catch (error) {
    console.log("Error calculating expenditure:", error);
  }
}

async function expandOrdersList() {
  const mainElement = document.querySelector(
    ".LayerManager__ChildrenContainer-sc-1k2ulq-0"
  );
  if (mainElement) {
    while (document.querySelector(".iMIGfw")) {
      console.log("Clicked on 'load more' button.");
      document.querySelector(".iMIGfw").click();
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    console.log("Finished expanding the orders list.");
  }
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
    totalOrders: 0,
    favRest: {
      byAmountSpent: {
        1: { restaurant: "", amountSpent: 0 },
        2: { restaurant: "", amountSpent: 0 },
        3: { restaurant: "", amountSpent: 0 },
      },
      byOrdersPlaced: {
        1: { restaurant: "", orderCount: 0 },
        2: { restaurant: "", orderCount: 0 },
        3: { restaurant: "", orderCount: 0 },
      },
    },
    months: {
      mostExpensiveMonth: { month: "", amountSpent: 0 },
      Jan: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "",
        mostOrders: 0,
        restaurantList: {},
      },
      Feb: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "",
        mostOrders: 0,
        restaurantList: {},
      },
      Mar: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "",
        mostOrders: 0,
        restaurantList: {},
      },
      Apr: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "",
        mostOrders: 0,
        restaurantList: {},
      },
      May: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "",
        mostOrders: 0,
        restaurantList: {},
      },
      Jun: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "",
        mostOrders: 0,
        restaurantList: {},
      },
      Jul: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "",
        mostOrders: 0,
        restaurantList: {},
      },
      Aug: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "",
        mostOrders: 0,
        restaurantList: {},
      },
      Sep: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "",
        mostOrders: 0,
        restaurantList: {},
      },
      Oct: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "",
        mostOrders: 0,
        restaurantList: {},
      },
      Nov: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "",
        mostOrders: 0,
        restaurantList: {},
      },
      Dec: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "",
        mostOrders: 0,
        restaurantList: {},
      },
    },
  };

  ordersList.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const restaurantName =
        node
          .querySelector(".Text-sc-16fu6d-0.sc-7ff7002-1")
          ?.textContent.trim() || "No restaurant name found";
      const amountText = node
        .querySelector(".order-detail-body-wrapper")
        .firstChild.firstChild.firstChild.firstChild?.textContent.split(
          " • "
        )[1]
        .split("$")[1];
      const amount = parseFloat(amountText) || 0.0;
      const dateString = node
        .querySelector(".order-detail-body-wrapper")
        .firstChild.firstChild.firstChild.firstChild?.textContent.split(
          " • "
        )[0]
        .split(",")[1];
      const month = dateString.slice(1, 4);
      console.log(restaurantName, amount, month);
      if (restaurantName !== "No restaurant name found") {
        updateOrderList(restaurantName, amount, month, orderListJson);
      }
    }
  });

  return orderListJson;
}

function updateOrderList(restaurantName, amount, month, orderListJson) {
  if (!orderListJson[restaurantName]) {
    orderListJson[restaurantName] = { visits: 1, totalSpent: amount };
  } else {
    orderListJson[restaurantName].visits++;
    orderListJson[restaurantName].totalSpent += amount;
  }

  updateMonthlyStats(restaurantName, amount, month, orderListJson);

  orderListJson.totalAmountSpent += amount;
  orderListJson.totalOrders += 1;

  updateFavRest(restaurantName, orderListJson);
}

function updateMonthlyStats(restaurantName, amount, month, orderListJson) {
  orderListJson["months"][month]["totalAmount"] += amount;
  if (
    orderListJson["months"]["mostExpensiveMonth"]["amountSpent"] <
    orderListJson["months"][month]["totalAmount"]
  ) {
    orderListJson["months"]["mostExpensiveMonth"]["amountSpent"] =
      orderListJson["months"][month]["totalAmount"];
    orderListJson["months"]["mostExpensiveMonth"]["month"] =
      getFullMonthName(month);
  }

  orderListJson["months"][month]["totalOrders"] += 1;

  if (!orderListJson["months"][month]["restaurantList"][restaurantName]) {
    orderListJson["months"][month]["restaurantList"][restaurantName] = 1;
  } else {
    orderListJson["months"][month]["restaurantList"][restaurantName] += 1;
  }

  if (
    orderListJson["months"][month]["mostOrders"] <
    orderListJson["months"][month]["restaurantList"][restaurantName]
  ) {
    orderListJson["months"][month]["mostOrders"] =
      orderListJson["months"][month]["restaurantList"][restaurantName];
    orderListJson["months"][month]["favRest"] = restaurantName;
  }
}

function getFullMonthName(monthName) {
  var date = new Date(monthName + " 1, 1970");
  var fullMonthName = date.toLocaleString("default", { month: "long" });

  return fullMonthName;
}
function updateFavRest(restaurantName, orderListJson) {
  const favRest = orderListJson.favRest;
  const totalAmount = orderListJson[restaurantName].totalSpent;
  const totalOrders = orderListJson[restaurantName].visits;

  topThreeAmountSpent(restaurantName, orderListJson, totalAmount, favRest, 1);

  topThreeOrdersCount(restaurantName, orderListJson, totalOrders, favRest, 1);
}

function topThreeAmountSpent(
  restaurantName,
  orderListJson,
  totalAmount,
  favRest,
  index
) {
  if (index > 3) {
    return;
  } else {
    if (favRest["byAmountSpent"][index]["amountSpent"] < totalAmount) {
      favRest["byAmountSpent"][index]["restaurant"] = restaurantName;
      favRest["byAmountSpent"][index]["amountSpent"] = totalAmount;
    } else {
      topThreeAmountSpent(
        restaurantName,
        orderListJson,
        totalAmount,
        favRest,
        index + 1
      );
    }
  }

  return;
}

function topThreeOrdersCount(
  restaurantName,
  orderListJson,
  totalOrders,
  favRest,
  index
) {
  if (index > 3) {
    return;
  } else {
    if (favRest["byOrdersPlaced"][index]["orderCount"] < totalOrders) {
      favRest["byOrdersPlaced"][index]["restaurant"] = restaurantName;
      favRest["byOrdersPlaced"][index]["orderCount"] = totalOrders;
    } else {
      topThreeOrdersCount(
        restaurantName,
        orderListJson,
        totalOrders,
        favRest,
        index + 1
      );
    }
  }

  return;
}
