chrome.runtime.onMessage.addListener(
  (
    message: string,
    sender: { origin: string },
    sendResponse: (ret: any) => void
  ) => {
    console.debug("received msg: ", message);
    console.debug("sender: ", sender);
    console.debug("sender: ", sender.origin);
    console.debug("sending response: ", sendResponse("send response"));

    const { action, payload } = JSON.parse(message);
    console.debug("payload: ", payload);

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
          console.debug("Opened popup!");
        }
      );
    }
  }
);
export {};
