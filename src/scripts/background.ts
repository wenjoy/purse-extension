// import { ethers } from "ethers";

import persist from "../service/persist";

//eslint-disable-next-line
let wallet: any = null;

enum Event {
  eth_accounts = "eth_accounts",
  eth_chainId = "eth_chainId",
}

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

    if (action === Event.eth_accounts) {
      console.debug("background--eth_accounts", Event.eth_accounts);
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: Event.eth_accounts,
          payload: wallet,
        });
      });
    }

    if (action === Event.eth_chainId) {
      console.log("background--eth_chainId", Event.eth_chainId);
      chrome.tabs.query(
        { active: true, currentWindow: true },
        async (tabs: any) => {
          const { chainId } = await persist.get("selectedNetwork");
          chrome.tabs.sendMessage(tabs[0].id, {
            type: Event.eth_accounts,
            payload: chainId,
          });
        }
      );
    }

    if (action === "WALLET") {
      console.log("set wallet");
      wallet = payload;
    }
  }
);
export {};
