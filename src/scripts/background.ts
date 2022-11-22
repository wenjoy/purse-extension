chrome.runtime.onMessage.addListener((request: string) => {
  console.log("message is: ", request);

  if (request == "OpenPopup") {
    chrome.windows.create(
      {
        url: "popup.html",
        type: "popup",
        focused: true,
        width: 400,
        height: 600,
        top: 0,
        left: 0,
      },
      () => {
        console.log("Opened popup!");
      }
    );
  }
});
export {};
