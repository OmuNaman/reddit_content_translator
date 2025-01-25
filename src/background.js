import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI;
let model;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate') {
    handleTranslation(request.text).then(translation => {
      sendResponse({ text: translation });
    });
    return true;
  }
});

async function handleTranslation(text) {
  try {
    if (!genAI) {
      const { geminiApiKey } = await chrome.storage.local.get(['geminiApiKey']);
      if (!geminiApiKey) return "⚠️ Set API key first";
      genAI = new GoogleGenerativeAI(geminiApiKey);
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    const result = await model.generateContent(
      `Translate to English while preserving tone and slang:\n\n${text}`
    );
    return result.response.text();
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}