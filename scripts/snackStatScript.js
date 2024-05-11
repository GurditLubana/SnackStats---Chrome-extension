chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "fetchedData") {
    const reportData = message.fetchedData;

    if (document.readyState === "complete") {
      console.log("Ready to Show data.");
      // console.log(reportData)
      provideLink(reportData);
    } else {
      window.addEventListener("load", () => {
        console.log("Not yet loaded completely.");
      });
    }
  }
});

function provideLink(reportData) {
  const inputElement = document.getElementById("inputElement");
  const submitBtn = document.getElementById("submitBtn");

  var event = new Event("input", { bubbles: true });

  inputElement.value = JSON.stringify(reportData);
  inputElement.dispatchEvent(event);
  submitBtn.click();
}
