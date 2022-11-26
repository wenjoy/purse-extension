chrome.runtime.onMessage.addListener(
  (
    message: string,
    sender: { origin: string },
    sendResponse: (ret: any) => void
  ) => {
    console.log("received msg: ", message);
    console.log("sender: ", sender);
    console.log("sender: ", sender.origin);
    console.log("sending response: ", sendResponse("send response"));

    const { action, payload } = JSON.parse(message);
    console.log("payload: ", payload);

    if (action == "OpenPopup") {
      chrome.windows.create(
        {
          url: `connect.html?origin=${sender.origin}`,
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
  }
);
export {};
