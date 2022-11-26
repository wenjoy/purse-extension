const s = document.createElement("script");
s.src = chrome.runtime.getURL("inject.js");
s.onload = function () {
  s.remove();
};
(document.head || document.documentElement).appendChild(s);

// var port = chrome.runtime.connect();

window.addEventListener(
  "message",
  async (event) => {
    console.log("receive message from page context: ", event);

    // We only accept messages from ourselves
    if (event.source != window) {
      return;
    }

    if (event.data.type && event.data.type == "FROM_PAGE") {
      const payload = event.data;
      // port.postMessage(event.data.text);
      const body = { action: "OpenPopup", payload };
      const result = await chrome.runtime.sendMessage(JSON.stringify(body));
      console.log("result", result);
    }
  },
  false
);

export {};
