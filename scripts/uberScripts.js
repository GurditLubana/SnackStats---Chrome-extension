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

    chrome.runtime.sendMessage({
      action: "dataFetched",
      orderHistoryStat: orderListJson,
    });
    console.log(orderListJson);
    removeLoadingScreen()
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


function removeLoadingScreen(){

  let loadingScreen = document.getElementById("loadingScreen");
  loadingScreen.remove();
}