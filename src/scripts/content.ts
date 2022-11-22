const s = document.createElement("script");
s.src = chrome.runtime.getURL("inject.js");
s.onload = function () {
  s.remove();
};
(document.head || document.documentElement).appendChild(s);

// var port = chrome.runtime.connect();

window.addEventListener(
  "message",
  (event) => {
    console.log("message", event);

    // We only accept messages from ourselves
    if (event.source != window) {
      return;
    }

    if (event.data.type && event.data.type == "FROM_PAGE") {
      console.log("Content script received: " + event.data.text);
      // port.postMessage(event.data.text);
      chrome.runtime.sendMessage("OpenPopup");
    }
  },
  false
);

export {};
