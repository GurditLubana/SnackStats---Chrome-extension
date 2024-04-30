if (document.readyState === "complete") {
  console.log("Ready to Fetch the data.");

  calculateExpenditure();
} else {
  window.addEventListener("load", () => {
    console.log("UberEats not yet loaded completely.");
  });
}

async function calculateExpenditure() {
  showLoadingPage();
  const mainContent = document.getElementById("main-content");
  if (mainContent) {
    const orderList = mainContent.firstChild;

    if (orderList.children.length <= 1) {
      console.log("no orders in the cart");
      noOrdersInCartScreen();
    } else {
      await expandOrderList(orderList);

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
        if (node.className === "al") {
          processDataNode(node, orderListJson);
        }
      });

      if (Object.keys(orderListJson).length > 4) {
        chrome.runtime.sendMessage({
          action: "dataFetched",
          orderHistoryStat: orderListJson,
        });
      }
      console.log(orderListJson);
      removeLoadingScreen();
    }
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
  try {
    const orderInfo = node.children[2].children[0].children[0].children[0];
    const restaurantName = orderInfo.children[0].children[0].textContent.trim();
    const amountString =
      orderInfo.children[1].children[0].firstChild.textContent;
    const monthString =
      orderInfo.children[1].children[0].childNodes[2].textContent.trim();
    let amount = amountString.split("$")[1]
      ? parseFloat(amountString.split("$")[1].trim())
      : 0.0;
    const date = monthString.split("at")[0];
    const month = date.slice(-7, -4);

    updateOrderStats(restaurantName, amount, month, orderListJson);
  } catch (error) {
    console.log(error);
  }
}

function updateOrderStats(restaurantName, amount, month, orderListJson) {
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
  let creature = document.getElementsByClassName("creature")[0];
  creature.src = chrome.runtime.getURL("Images/noOrderCreature.png");

  let loadingText = document.getElementsByClassName("loading-text")[0];
  loadingText.textContent = "Sorry! No Orders Available...";
  setTimeout(function () {
    removeLoadingScreen();
  }, 1500);
}
