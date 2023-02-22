import { ethers } from "ethers";
import persist from "../service/persist";

//eslint-disable-next-line
let wallet: any = null;

enum Action {
  eth_accounts = "eth_accounts",
  eth_chainId = "eth_chainId",
  eth_call = "eth_call",
  open_popup = "OpenPopup",
  set_wallet = "WALLET",
}

type Message = {
  action: Action;
  payload: any;
};

// TODO: setup store as a local database
// const store = new Store();

chrome.runtime.onMessage.addListener(
  async (
    message: any,
    sender: { origin: string },
    sendResponse: (ret: any) => void
  ) => {
    console.debug(
      "received msg from content(message, sender, sendResponse): ",
      message,
      sender,
      sendResponse
    );

    //TODO: no need to parse, always requre sender send obeject
    // const { action, payload } =
    //   (typeof message as string) === "string" ? JSON.parse(message) : message;
    const { action, payload }: Message = message;

    if (action == Action.open_popup) {
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

    if (action === Action.eth_accounts) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: Action.eth_accounts,
          payload: wallet,
        });
      });
    }

    if (action === Action.eth_chainId) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        async (tabs: any) => {
          const network = await persist.get("selectedNetwork");

          const {
            selectedNetwork: { chainId },
          } = network;
          chrome.tabs.sendMessage(tabs[0].id, {
            type: Action.eth_chainId,
            payload: chainId,
          });
        }
      );
    }

    if (action === Action.eth_call) {
      const network = await persist.get("selectedNetwork");
      const {
        selectedNetwork: { name },
      } = network;

      const networkName = name === "unknown" ? "http://localhost:8545" : name;
      const provider = ethers.getDefaultProvider(networkName, {
        alchemy: "YA4l5t9NnZlEYLOF0MqW5Dtmn8xKUOAo",
        etherscan: "C4YT7SIA975H8SYVH51W42MUQG1NENZ2HF",
      });
      const result = await provider.call(payload[0]);
      console.debug("background--result", result);
      chrome.tabs.query(
        { active: true, currentWindow: true },
        async (tabs: any) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: Action.eth_call,
            payload: result,
          });
        }
      );
    }

    if (action === Action.set_wallet) {
      wallet = payload;
    }
  }
);
export {};
