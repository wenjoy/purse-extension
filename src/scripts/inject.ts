// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.openWallet = () => {
  console.log("opening wallet");
  window.postMessage(
    { type: "FROM_PAGE", text: "Hello from the webpage!" },
    "*"
  );
};

export {};
