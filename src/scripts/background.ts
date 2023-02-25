import { ethers } from "ethers";
import persist from "../service/persist";

// Workaround because import from web3provider will lead to sytax error
enum Event {
  eth_accounts = "eth_accounts",
  eth_chainId = "eth_chainId",
  eth_call = "eth_call",
  eth_blockNumber = "eth_blockNumber",
  eth_estimateGas = "eth_estimateGas",
  eth_sendTransaction = "eth_sendTransaction",
  eth_getTransactionByHash = "eth_getTransactionByHash",
  eth_getTransactionReceipt = "eth_getTransactionReceipt",
}

let walletPricateKey = "";

export enum Action {
  open_popup = "OpenPopup",
  set_wallet_privateKey = "WALLET",
}

type Message = {
  action: Action | Event;
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
    const network = await persist.get("selectedNetwork");
    const {
      selectedNetwork: { name },
    } = network;

    const networkName = name === "unknown" ? "http://localhost:8545" : name;
    const provider = ethers.getDefaultProvider(networkName, {
      alchemy: "YA4l5t9NnZlEYLOF0MqW5Dtmn8xKUOAo",
      etherscan: "C4YT7SIA975H8SYVH51W42MUQG1NENZ2HF",
    });

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

    if (action === Event.eth_accounts) {
      if (!walletPricateKey) {
        return;
      }
      const wallet = new ethers.Wallet(walletPricateKey);
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: Event.eth_accounts,
          payload: wallet,
        });
      });
    }

    if (action === Event.eth_chainId) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        async (tabs: any) => {
          const network = await persist.get("selectedNetwork");

          const {
            selectedNetwork: { chainId },
          } = network;
          chrome.tabs.sendMessage(tabs[0].id, {
            type: Event.eth_chainId,
            payload: chainId,
          });
        }
      );
    }

    if (action === Event.eth_call) {
      const result = await provider.call(payload[0]);
      console.debug("background--result", result);
      chrome.tabs.query(
        { active: true, currentWindow: true },
        async (tabs: any) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: Event.eth_call,
            payload: result,
          });
        }
      );
    }

    if (action === Event.eth_blockNumber) {
      const blockNumber = await provider.getBlockNumber();

      chrome.tabs.query(
        { active: true, currentWindow: true },
        async (tabs: any) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: Event.eth_blockNumber,
            payload: blockNumber,
          });
        }
      );
    }

    if (action === Event.eth_estimateGas) {
      const gas = await provider.getGasPrice();

      chrome.tabs.query(
        { active: true, currentWindow: true },
        async (tabs: any) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: Event.eth_estimateGas,
            payload: gas,
          });
        }
      );
    }

    if (action === Event.eth_sendTransaction) {
      if (!walletPricateKey) {
        return;
      }

      const wallet = new ethers.Wallet(walletPricateKey);
      const transaction = payload[0];
      const blockNumber = await provider.getBlockNumber();
      const nonce = blockNumber;
      transaction.gasPrice = transaction.gas;
      // at least 21864, maximum is 30000000
      transaction.gasLimit = BigInt(30000000);
      transaction.nonce = nonce;
      delete transaction.gas;

      const signedTransaction = await wallet.signTransaction(transaction);
      const result = await provider.sendTransaction(signedTransaction);

      chrome.tabs.query(
        { active: true, currentWindow: true },
        async (tabs: any) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: Event.eth_sendTransaction,
            payload: result.hash,
          });
        }
      );
    }

    if (action === Event.eth_getTransactionByHash) {
      const transaction = await provider.getTransaction(payload[0]);

      chrome.tabs.query(
        { active: true, currentWindow: true },
        async (tabs: any) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: Event.eth_getTransactionByHash,
            payload: transaction,
          });
        }
      );
    }

    if (action === Event.eth_getTransactionReceipt) {
      const transaction = await provider.getTransactionReceipt(payload[0]);

      chrome.tabs.query(
        { active: true, currentWindow: true },
        async (tabs: any) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: Event.eth_getTransactionReceipt,
            payload: transaction,
          });
        }
      );
    }

    if (action === Action.set_wallet_privateKey) {
      walletPricateKey = payload;
    }
  }
);
export {};
