if (document.readyState === "complete") {
  console.log("Ready to Fetch the data.");

  const currentUrl = window.location.href;
  if (currentUrl.includes("identity.doordash.com/auth?")) {
    console.log("We are on the DoorDash authentication page.");
    askToLogin();
  } else {
    calculateExpenditure();
  }
} else {
  window.addEventListener("load", () => {
    console.log("Doordash not yet loaded completely.");
  });
}

async function calculateExpenditure() {
  showLoadingPage();
  try {
    await expandOrdersList();

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
      years:{},
    };

    const result = fetchOrdersData(orderListJson);
    if (result) {
      chrome.runtime.sendMessage({
        action: "dataFetched",
        orderHistoryStat: orderListJson,
      });
      console.log(orderListJson);
      removeLoadingScreen();
    } else {
      noOrdersInCartScreen();
    }
  } catch (error) {
    console.log("Error calculating expenditure:", error);
  }
}

async function expandOrdersList() {
  const mainElement = document.body.querySelector(
    ".LayerManager__ChildrenContainer-sc-1k2ulq-0"
  );
  if (mainElement) {
    while (document.body.querySelector(".iMIGfw")) {
      console.log("Clicked on 'load more' button.");
      document.body.querySelector(".iMIGfw").click();
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    console.log("Finished expanding the orders list.");
  }
}

function fetchOrdersData(orderListJson) {
  let mainContent = document.body.querySelector(
    ".LayerManager__ChildrenContainer-sc-1k2ulq-0"
  );
  console.log("main element found", mainContent);

  let ordersListTab = document.querySelector(
    '.StackChildren__StyledStackChildren-sc-1tveqpz-0[data-testid="OrdersV2"]'
  );

  if (ordersListTab) {
    // console.log("this is orders List", ordersListTab);
    // console.log("length ", ordersListTab.children.length);
    const ordersList = ordersListTab.children[2];
    

    ordersList.childNodes.forEach(async (node, index) => {
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
          .split(",");
        const month = dateString[1].slice(1, 4);
        const currentDay = dateString[0].trim();
        const day = dateString[1].slice(4).trim();

        const monthMapping = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
          Apr: 3,
          May: 4,
          Jun: 5,
          Jul: 6,
          Aug: 7,
          Sep: 8,
          Oct: 9,
          Nov: 10,
          Dec: 11,
        };

        const weekMapping = {
          Sun: 0,
          Mon: 1,
          Tue: 2,
          Wed: 3,
          Thu: 4,
          Fri: 5,
          Sat: 6,
        };

        let currentYear = new Date().getFullYear();

        const monthNumeric = monthMapping[month];
        let dayOfWeek = -1;
        while (weekMapping[currentDay] !== dayOfWeek) {
          let date = new Date(currentYear, monthNumeric, day);

          dayOfWeek = date.getDay();

          currentYear -= 1;
        }

        
        if (restaurantName !== "No restaurant name found") {
          updateOrderList(restaurantName, amount, month, orderListJson, currentYear + 1);
        }
      }
    });
  } else {
    console.log("No order available");
    return false;
  }

  return true;
}

function updateOrderList(restaurantName, amount, month, orderListJson, year) {
  if (!orderListJson[restaurantName]) {
    orderListJson[restaurantName] = { visits: 1, totalSpent: amount };
  } else {
    orderListJson[restaurantName].visits++;
    orderListJson[restaurantName].totalSpent += amount;
  }

  updateMonthlyStats(restaurantName, amount, month, orderListJson, year);

  orderListJson.totalAmountSpent += amount;
  orderListJson.totalOrders += 1;

  updateFavRest(restaurantName, orderListJson);
}


function updateMonthlyStats(restaurantName, amount, month, orderListJson, currYear) {

  let year = orderListJson["years"]
  if(!year[currYear]){

    year[currYear] = {
      mostExpensiveMonth: { month: "", amountSpent: 0 },
      Jan: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "No Data Available",
        mostOrders: 0,
        restaurantList: {},
      },
      Feb: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "No Data Available",
        mostOrders: 0,
        restaurantList: {},
      },
      Mar: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "No Data Available",
        mostOrders: 0,
        restaurantList: {},
      },
      Apr: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "No Data Available",
        mostOrders: 0,
        restaurantList: {},
      },
      May: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "No Data Available",
        mostOrders: 0,
        restaurantList: {},
      },
      Jun: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "No Data Available",
        mostOrders: 0,
        restaurantList: {},
      },
      Jul: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "No Data Available",
        mostOrders: 0,
        restaurantList: {},
      },
      Aug: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "No Data Available",
        mostOrders: 0,
        restaurantList: {},
      },
      Sep: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "No Data Available",
        mostOrders: 0,
        restaurantList: {},
      },
      Oct: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "No Data Available",
        mostOrders: 0,
        restaurantList: {},
      },
      Nov: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "No Data Available",
        mostOrders: 0,
        restaurantList: {},
      },
      Dec: {
        totalAmount: 0,
        totalOrders: 0,
        favRest: "No Data Available",
        mostOrders: 0,
        restaurantList: {},
      },
    }
  }
  year[currYear][month]["totalAmount"] += amount;
  if (
    year[currYear]["mostExpensiveMonth"]["amountSpent"] <
    year[currYear][month]["totalAmount"]
  ) {
    year[currYear]["mostExpensiveMonth"]["amountSpent"] =
      year[currYear][month]["totalAmount"];
    year[currYear]["mostExpensiveMonth"]["month"] =
      getFullMonthName(month);
  }

  year[currYear][month]["totalOrders"] += 1;

  if (!year[currYear][month]["restaurantList"][restaurantName]) {
    year[currYear][month]["restaurantList"][restaurantName] = 1;
  } else {
    year[currYear][month]["restaurantList"][restaurantName] += 1;
  }

  if (
    year[currYear][month]["mostOrders"] <
    year[currYear][month]["restaurantList"][restaurantName]
  ) {
    year[currYear][month]["mostOrders"] =
      year[currYear][month]["restaurantList"][restaurantName];
    year[currYear][month]["favRest"] = restaurantName;
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

  console.log(loadingScreen);
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
