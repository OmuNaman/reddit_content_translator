# Reddit Translator Extension (Gemini)

1. **Set API Key**: In `background.js`, replace `YOUR_GEMINI_API_KEY` with your actual key.
2. **Load Extension**:
   - Go to `chrome://extensions` in Google Chrome.
   - Turn on “Developer mode” (top-right).
   - Click **Load unpacked** and select this folder.
3. **Usage**:
   - Open any Reddit post page.
   - The extension automatically tries to translate the text to English.
   - Open Console to see logs if translation fails or you want debug info.
4. **Caution**:
   - This calls the model **for every single** text block. Expect slow performance or usage spikes.
   - For production, batch text or set up a server approach.
