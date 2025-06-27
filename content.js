let host;
let popups = [];

/**
 * 1) Build Shadow DOM host and inject popup HTML/CSS once
 */
async function initPopup() {
  if (host) return;

  host = document.createElement("div");
  host.id = "simplr-popup-host";
  const shadow = host.attachShadow({ mode: "open" });

  // inject styles
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("popup/styles.css");
  shadow.appendChild(link);

  // inject HTML
  const res = await fetch(chrome.runtime.getURL("popup/popup.html"));
  const html = await res.text();
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  shadow.appendChild(wrapper);

  // grab both containers and hide them
  popups = Array.from(shadow.querySelectorAll(".popup-container"));
  popups.forEach((p) => (p.style.display = "none"));

  // wire up close buttons
  popups.forEach((p) => {
    const btn = p.querySelector(".popup-close");
    if (btn) btn.addEventListener("click", () => (p.style.display = "none"));
  });

  // Add Google search on click for definition word-display
  const defContainer = popups.find((p) => p.dataset.mode === "definition");
  if (defContainer) {
    const wordDisplay = defContainer.querySelector(".word-display");
    wordDisplay.style.cursor = "pointer";
    wordDisplay.title = "Search this word on Google";
    wordDisplay.onclick = (e) => {
      e.stopPropagation();
      const word = wordDisplay.textContent.trim();
      if (word && word !== "Loading...") {
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(word)}`,
          "_blank",
          "noopener"
        );
      }
    };
  }

  document.body.appendChild(host);
}

/**
 * 2) Utility to show exactly one state in one mode
 *    - mode: "definition" or "simplify"
 *    - stateId: e.g. "#loadingState" or "#definitionTemplate" or "#simplify-loading", "#simplifyResult"
 */
function switchTo(mode, stateId) {
  popups.forEach((p) => {
    if (p.getAttribute("data-mode") === mode) {
      // hide all state elements
      p.querySelectorAll(".state").forEach((s) => (s.style.display = "none"));
      // show the requested state
      const active = p.querySelector(stateId);
      if (active)
        active.style.display = active.classList.contains("loading-state")
          ? "flex"
          : "block";
      // position & show
      Object.assign(p.style, {
        position: "fixed",
        top: "48px",
        right: "20px",
        left: "auto",
        zIndex: "2147483647",
        display: "block",
      });
    } else {
      p.style.display = "none";
    }
  });
}

/**
 * 3a) Definition flow (Alt only)
 */
async function showDefinition() {
  const sel = window.getSelection().toString().trim();
  if (!sel) return;

  await initPopup();

  // set the selected word and show spinner
  const defContainer = popups.find((p) => p.dataset.mode === "definition");
  defContainer.querySelector("#selectedWord").textContent = sel;
  switchTo("definition", "#loadingState");

  // fetch definition
  let data;
  try {
    data = await window.fetchDefinition(sel);
  } catch (err) {
    console.error(err);
    return switchTo("definition", "#errorState");
  }

  // handle empty selected word
  if (!data.definition) {
    defContainer.querySelector(
      "#emptyMessage"
    ).textContent = `No definition found`;
    return switchTo("definition", "#emptyState");
  }

  // show the definition
  defContainer.querySelector("#pronunciationEl").textContent =
    data.pronunciation;
  defContainer.querySelector("#partOfSpeechEl").textContent = data.partOfSpeech;
  defContainer.querySelector("#definitionEl").textContent = data.definition;
  defContainer.querySelector("#exampleEl").textContent = data.example || "";
  switchTo("definition", "#definitionTemplate");
}

/**
 * 3b) Simplification flow (Ctrl+Alt)
 */
async function showSimplification() {
  const sel = window.getSelection().toString();
  if (!sel) return;

  await initPopup();

  // show spinner
  const simContainer = popups.find((p) => p.dataset.mode === "simplify");
  // Set the selected text, truncated, in green
  const wordDisplay = simContainer.querySelector(".word-display");
  wordDisplay.textContent = sel.length > 50 ? sel.slice(0, 47) + "..." : sel;
  wordDisplay.style.color = "#4caf50";
  switchTo("simplify", "#simplify-loading");

  // calling the AI stub
  let result;
  try {
    result = await window.simplifyText(sel);
  } catch (err) {
    console.error(err);
    result = "Error simplifying";
  }

  // Make sure the selected text is still visible after loading
  wordDisplay.textContent = sel.length > 50 ? sel.slice(0, 47) + "..." : sel;
  wordDisplay.style.color = "#4caf50";

  // populate & show
  simContainer.querySelector("#simplifyResult").textContent = result;
  switchTo("simplify", "#simplifyResult");
}

/**
 * 4) Hide all popups
 */
function hideAll() {
  popups.forEach((p) => (p.style.display = "none"));
}

/**
 * 5) Event listeners for keyboard shortcuts and click‐away
 */
//alt d and alt s to show definition and simplification
document.addEventListener("keydown", (e) => {
  if (e.altKey && e.key.toLowerCase() === "d") {
    e.preventDefault();
    showDefinition();
  } else if (e.altKey && e.key.toLowerCase() === "s") {
    e.preventDefault();
    showSimplification();
  } else if (e.key === "Escape") hideAll();
});
// click‐away closes
document.addEventListener("click", (e) => {
  if (host && !host.contains(e.target)) hideAll();
});
