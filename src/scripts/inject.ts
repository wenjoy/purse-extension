// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.openWallet = ({ message }: { message: string }) => {
  console.log("get message from page context", message);
  window.postMessage({ type: "FROM_PAGE", payload: null }, "*");
};

export {};
