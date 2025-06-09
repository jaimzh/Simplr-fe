# Simplr Chrome Extension

Simplr is a Chrome extension that provides instant word definitions and AI-powered text simplification directly on any webpage. Designed for students, researchers, and everyday users, it helps you understand content without leaving your current tab.

**Backend for Simplr Chrome Extension Repo:** [Simplr Backend](https://github.com/jaimzh/Simplr-be)
---

## Features

- **Instant Definitions:** Highlight a word and press `Alt + D` for a quick definition.
- **AI Text Simplification:** Select a sentence and press `Alt + S` to simplify complex text.
- **Minimal, Non-Intrusive UI:** Clean popup using Shadow DOM to avoid interfering with page content.
- **Keyboard Shortcuts:** Fast, intuitive access—no need to open new tabs.
- **Privacy First:** No tracking or data collection.

---

## Installation

1. **Clone or Download:**
   ```bash
   git clone https://github.com/yourusername/simplr-extension.git
   ```
2. **Open Chrome Extensions:**  
   Go to `chrome://extensions/` in Chrome.
3. **Enable Developer Mode:**  
   Toggle the switch in the top-right corner.
4. **Load Unpacked:**  
   Click **Load unpacked** and select the extension folder.
5. **Pin the Extension:**  
   Click the puzzle icon in the toolbar and pin Simplr.

---

## Usage

1. **Highlight Text:** Select a word or sentence on any webpage.
2. **Keyboard Shortcuts:**
   - `Alt + D` — Get a definition.
   - `Alt + S` — Simplify selected text.
3. **Popup:**  
   Results appear in a popup. Use the close button or press `Escape` to dismiss.

---

## Development

- **Tech Stack:**  
  Vanilla JavaScript (ES6+), Chrome Extension Manifest V3, Shadow DOM
- **APIs:**  
  [DictionaryAPI.dev](https://dictionaryapi.dev/) for definitions, custom backend for simplification
- **Structure:**  
  - Core logic: `content.js`, `utils/api.js`
  - UI: `popup/` directory

---

## Contributing

Contributions are welcome!  
1. Fork the repository.
2. Create a feature branch.
3. Make clear, documented changes.
4. Open a pull request.

Please keep the interface minimal and the functionality focused.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Contact

For questions or feedback, open an issue or reach out via GitHub.
