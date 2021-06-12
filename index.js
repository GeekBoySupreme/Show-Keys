chrome.runtime.onMessage.addListener(keyToggle);

let toggle_state = 0;

function keyToggle(togglekey) {
  if (togglekey.state == 1) {
    toggle_state = 1;
  } else if (togglekey.state == 0) {
    toggle_state = 0;
  }
}

const prettyMap = {
  ArrowUp: "↑",
  ArrowRight: "→",
  ArrowDown: "↓",
  ArrowLeft: "←",
  Shift: "⇧",
  Meta: "⌘",
  Alt: "⌥",
  Control: "^",
  Escape: "esc",
  Backspace: "⌫",
  Enter: "⏎",
  32: "space",
  CapsLock: "caps lock",
  Tab: "tab",
};

let keys = [];
let appearedAt = null;

const handler = (event) => {
  if (
    window.SHOW_KEYS_SKIP_INPUTS &&
    ["INPUT", "TEXTAREA"].includes(event.target.tagName)
  ) {
    return;
  }

  const key =
    prettyMap[event.key] || prettyMap[event.which] || event.key.toUpperCase();

  const modifiers = {
    Meta: event.metaKey,
    Shift: event.shiftKey,
    Alt: event.altKey,
    Control: event.ctrlKey,
  };

  const newKeys = [];

  Object.keys(modifiers)
    .filter((modifier) => modifiers[modifier])
    .forEach((modifier) => newKeys.push(prettyMap[modifier]));

  if (!Object.keys(modifiers).includes(event.key)) newKeys.push(key);

  const dismissAfterTimeout = () => {
    // TODO: Should probably clear this timeout
    window.setTimeout(() => {
      if (appearedAt === null) return;
      else if (new Date() - appearedAt < 1000) dismissAfterTimeout();
      else {
        keys = [];
        if (toggle_state == 1) render();
      }
    }, 1000);
  };

  keys = newKeys;
  appearedAt = new Date();
  if (toggle_state == 1) render();
  dismissAfterTimeout();
};

const css = `
  [data-keys] {
    display: flex;
    background: #2e2e2e;
    border-radius: 6px;
    position: fixed;
    z-index: 1000000;
    top: 20px;
    right: 20px;
    padding: 8px;
    font-size: 24px;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    animation: keys-zoom-in 50ms;
  }
  [data-keys][data-children="0"] {
    opacity: 0;
  }
  [data-keys] [data-key] + [data-key] {
    margin-left: 10px;
  }
  [data-keys] [data-key] {
    height: 58px;
    min-width: 58px;
    padding: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #2e2e2e;
    background: #ffffff;
    border-radius: 5px;
  }
  @keyframes keys-zoom-in {
    from {
      transform: scale(0.9);
    }
    100% {
    }
  }
`;

const insertCSS = () => {
  const cssExists = document.head.querySelector("#keyscss");
  if (!cssExists) {
    const cssContainer = document.createElement("style");
    cssContainer.id = "keyscss";
    document.head.append(cssContainer);
    cssContainer.append(css);
  }
};

const ensureContainer = () => {
  let container = document.querySelector("[data-keys]");

  if (!container) {
    container = document.createElement("div");
    container.setAttribute("data-keys", "");
    document.body.append(container);
    return container;
  } else {
    return container;
  }
};

const render = () => {
  const container = ensureContainer();

  if (keys.length === 0) container.outerHTML = ``;
  else {
    container.outerHTML = `
      <div data-keys>
        ${keys.map((key) => `<div data-key>${key}</div>`)}
      </div>
    `;
  }
};

if (typeof window !== "undefined") {
  window.addEventListener("keydown", handler);
  insertCSS();
}
