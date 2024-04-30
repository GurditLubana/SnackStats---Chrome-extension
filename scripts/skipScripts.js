if (document.readyState === "complete") {
  console.log("Ready to Fetch the data.");
  const currentUrl = window.location.href;
  if (currentUrl === "https://www.skipthedishes.com/") {
    askToLogin();
  } else {
    calculateExpenditure();
  }
} else {
  window.addEventListener("load", () => {
    console.log("Skip not yet loaded completely.");
  });
}
async function calculateExpenditure() {
  const mainElement = document.querySelector(".styles__Wrapper-sc-1kbgjlb-0");
  showLoadingPage();
  if (mainElement) {
    while (
      mainElement.querySelector(".styles__LoadMoreContainer-sc-dfy3yk-6")
    ) {
      console.log("Clicking on 'load more' button.");
      mainElement
        .querySelector(".styles__LoadMoreContainer-sc-dfy3yk-6")
        .firstChild.click();
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
      console.log("Order list not found.");
      noOrdersInCartScreen();
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
      try {
        const restaurantName = getRestaurantName(node);
        const amount = getAmount(node);
        const month = getMonth(node);
        if (restaurantName !== "No restaurant name found") {
          updateOrderList(restaurantName, amount, month, orderListJson);
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
  chrome.runtime.sendMessage({
    action: "dataFetched",
    orderHistoryStat: orderListJson,
  });
  console.log(orderListJson);
  removeLoadingScreen();
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

  topThreeAmountSpent(favRest, restaurantName, totalAmount);

  topThreeOrdersCount(favRest, restaurantName, totalOrders);
}

function topThreeAmountSpent(favRest, restaurant, newAmount) {
  let byAmountSpent = favRest.byAmountSpent;

  let existingEntryKey = Object.keys(byAmountSpent).find(
    (key) => byAmountSpent[key].restaurant === restaurant
  );

  if (
    existingEntryKey &&
    newAmount <= byAmountSpent[existingEntryKey].amountSpent
  ) {
    return;
  }

  if (existingEntryKey) {
    delete byAmountSpent[existingEntryKey];
  }

  let entries = Object.entries(byAmountSpent)
    .filter(([_, value]) => value.restaurant)
    .map(([key, value]) => ({ ...value, originalKey: key }));

  entries.push({ restaurant, amountSpent: newAmount });

  entries.sort((a, b) => b.amountSpent - a.amountSpent);

  if (entries.length > 3) {
    entries.pop();
  }

  entries.forEach((entry, index) => {
    byAmountSpent[index + 1] = {
      restaurant: entry.restaurant,
      amountSpent: entry.amountSpent,
    };
  });

  for (let i = entries.length + 1; i <= 3; i++) {
    byAmountSpent[i] = byAmountSpent[i] || { restaurant: "", amountSpent: 0 };
  }
}

function topThreeOrdersCount(favRest, restaurant, totalOrders) {
  let byOrdersPlaced = favRest.byOrdersPlaced;

  let existingEntryKey = Object.keys(byOrdersPlaced).find(
    (key) => byOrdersPlaced[key].restaurant === restaurant
  );

  if (
    existingEntryKey &&
    totalOrders <= byOrdersPlaced[existingEntryKey].orderCount
  ) {
    return;
  }

  if (existingEntryKey) {
    delete byOrdersPlaced[existingEntryKey];
  }

  let entries = Object.entries(byOrdersPlaced)
    .filter(([_, value]) => value.restaurant)
    .map(([key, value]) => ({ ...value, originalKey: key }));

  entries.push({ restaurant, orderCount: totalOrders });

  entries.sort((a, b) => b.orderCount - a.orderCount);

  if (entries.length > 3) {
    entries.pop();
  }

  entries.forEach((entry, index) => {
    byOrdersPlaced[index + 1] = {
      restaurant: entry.restaurant,
      orderCount: entry.orderCount,
    };
  });

  for (let i = entries.length + 1; i <= 3; i++) {
    byOrdersPlaced[i] = byOrdersPlaced[i] || { restaurant: "", orderCount: 0 };
  }
}

function showLoadingPage() {
  const loadingScreen = document.createElement("div");
  loadingScreen.id = "loadingScreen";
  loadingScreen.style.position = "fixed";
  loadingScreen.style.left = "0";
  loadingScreen.style.top = "0";
  loadingScreen.style.width = "100vw";
  loadingScreen.style.height = "100vh";
  loadingScreen.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  loadingScreen.style.zIndex = "100005";

  const creatureContainer = document.createElement("div");
  creatureContainer.className = "creature-container";

  const creatureImage = document.createElement("img");
  creatureImage.id = "creature";
  creatureImage.className = "creature";
  creatureImage.alt = "Creature Logo";
  creatureImage.style.height = "500px";
  creatureImage.style.width = "500px";
  creatureImage.src = chrome.runtime.getURL("Images/loadingCreature.png");

  creatureContainer.appendChild(creatureImage);

  const loadingText = document.createElement("div");
  loadingText.className = "loading-text";
  loadingText.textContent = "Fetching Orders Summary...";

  creatureContainer.appendChild(loadingText);

  loadingScreen.appendChild(creatureContainer);

  document.body.appendChild(loadingScreen);
}

function removeLoadingScreen() {
  let loadingScreen = document.getElementById("loadingScreen");
  loadingScreen.remove();
}

function noOrdersInCartScreen() {
  let creature = document.getElementById("creature");
  creature.src = chrome.runtime.getURL("Images/noOrderCreature.png");

  let loadingText = document.getElementsByClassName("loading-text")[0];
  loadingText.textContent = "Sorry! No Orders Available...";
  setTimeout(function () {
    removeLoadingScreen();
  }, 1500);
}

function askToLogin() {
  const loadingScreen = document.createElement("div");
  loadingScreen.id = "loadingScreen";
  loadingScreen.style.position = "fixed";
  loadingScreen.style.left = "0";
  loadingScreen.style.top = "0";
  loadingScreen.style.width = "100vw";
  loadingScreen.style.height = "100vh";
  loadingScreen.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  loadingScreen.style.zIndex = "100005";

  const creatureContainer = document.createElement("div");
  creatureContainer.className = "creature-container";

  const creatureImage = document.createElement("img");
  creatureImage.className = "creature";
  creatureImage.alt = "Creature Logo";
  creatureImage.style.height = "500px";
  creatureImage.style.width = "500px";
  creatureImage.src = chrome.runtime.getURL("Images/loginCreature.png");

  creatureContainer.appendChild(creatureImage);

  loadingScreen.appendChild(creatureContainer);

  document.body.appendChild(loadingScreen);

  setTimeout(function () {
    removeLoadingScreen();
  }, 1500);
}
