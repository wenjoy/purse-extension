chrome.runtime.onMessage.addListener((request: string) => {
  console.log("background message is: ", request);

  if (request == "OpenPopup") {
    chrome.windows.create(
      {
        url: "connect.html",
        type: "popup",
        focused: true,
        width: 450,
        height: 650,
        top: 0,
        left: 800,
      },
      () => {
        console.log("Opened popup!");
      }
    );
  }
});
export {};
