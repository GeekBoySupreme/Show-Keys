let flag = 0;

chrome.browserAction.onClicked.addListener(toggleShowKeys);
//chrome.tabs.onCreated.addListener(toggleShowKeys);
chrome.tabs.onUpdated.addListener(function (tabId) {
  let toggle = {
    message: "toggle",
    state: flag,
  };
  chrome.tabs.sendMessage(tabId, toggle);
});

function toggleShowKeys() {
  if (flag == 0) flag = 1;
  else if (flag == 1) flag = 0;

  let toggle = {
    message: "toggle",
    state: flag,
  };

  setIconNew(flag);
  chrome.tabs.query({}, function (tabs) {
    for (var i = 0; i < tabs.length; ++i) {
      chrome.tabs.sendMessage(tabs[i].id, toggle);
    }
  });
}

function setIconNew(value) {
  if (value == 0)
    chrome.browserAction.setIcon({
      path: { 19: "showkeys_16.png", 38: "showkeys_32.png" },
    });
  else if (value == 1) {
    chrome.browserAction.setIcon({
      path: { 19: "showkeys_blue_16.png", 38: "showkeys_blue_32.png" },
    });
  }
}
