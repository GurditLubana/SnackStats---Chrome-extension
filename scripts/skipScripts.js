if (document.readyState === "complete") {
  console.log("Ready to Fetch the data.");
  calculateExpenditure();
} else {
  window.addEventListener("load", () => {
    console.log("Skip not yet loaded completely.");
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

  orderList.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      try{

        const restaurantName = getRestaurantName(node);
        const amount = getAmount(node);
        const month = getMonth(node);
        if (restaurantName !== "No restaurant name found") {
          updateOrderList(restaurantName, amount, month, orderListJson);
        }
      }
      catch(error){
        console.log(error)
      }
    }
  });
  chrome.runtime.sendMessage({
    action: "dataFetched",
    orderHistoryStat: orderListJson,
  });
  console.log(orderListJson);
}

function getMonth(node) {
  const fulldate = node.querySelectorAll(
    ".styles__OrderDataText-sc-282i19-4"
  )[1];
  dateString = fulldate ? fulldate.textContent : null;
  let date = new Date(dateString);
  let monthName = date.toLocaleString("default", { month: "short" });

  return monthName;
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
