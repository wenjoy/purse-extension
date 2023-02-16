import persist from "../service/persist";

//eslint-disable-next-line
let wallet: any = null;

enum Action {
  eth_accounts = "eth_accounts",
  eth_chainId = "eth_chainId",
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
          const { chainId } = await persist.get("selectedNetwork");
          chrome.tabs.sendMessage(tabs[0].id, {
            type: Action.eth_chainId,
            payload: chainId,
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
