import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI;
let model;

// Handle translation requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate') {
    translateText(request.text)
      .then(translation => sendResponse({ text: translation }))
      .catch(error => {
        console.error('Translation error:', error);
        sendResponse({ text: request.text }); // Return original text on failure
      });
    return true; // Keep message channel open
  }
});

// Initialize Gemini AI once
async function initializeAI() {
  const { geminiApiKey } = await chrome.storage.local.get(['geminiApiKey']);
  if (!geminiApiKey) throw new Error('No API key found');
  
  genAI = new GoogleGenerativeAI(geminiApiKey);
  model = genAI.getGenerativeModel({ 
    model: "gemini-pro",
    generationConfig: {
      temperature: 0.9,
      topP: 1,
      maxOutputTokens: 4000
    }
  });
}

// Translation processor
async function translateText(text) {
  try {
    if (!genAI) await initializeAI();
    
    const prompt = `Translate this to English while preserving the original tone, slang, and internet culture nuances. Maintain formatting and special characters:\n\n${text}`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Translation failed:', error);
    throw error;
  }
}