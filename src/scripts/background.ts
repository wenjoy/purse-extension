// import { ethers } from "ethers";

//eslint-disable-next-line
let wallet: any = null;

chrome.runtime.onMessage.addListener(
  async (
    message: string,
    sender: { origin: string },
    sendResponse: (ret: any) => void
  ) => {
    console.debug("received msg: ", message);
    console.debug("sender: ", sender);
    console.debug("sender: ", sender.origin);
    console.debug("sending response: ", sendResponse("send response"));

    const { action, payload } =
      (typeof message as string) === "string" ? JSON.parse(message) : message;
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

    if (action === "GET_PROVIDER") {
      // const provider = ethers.getDefaultProvider('goerli', {
      //   alchemy: "YA4l5t9NnZlEYLOF0MqW5Dtmn8xKUOAo",
      //   etherscan: "C4YT7SIA975H8SYVH51W42MUQG1NENZ2HF",
      // });

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
        console.debug("background--provider", wallet, tabs);
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "PROVIDER",
          payload: wallet,
        });
      });
    }

    if (action === "WALLET") {
      console.log("set wallet");
      wallet = payload;
    }
  }
);
export {};
