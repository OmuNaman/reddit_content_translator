const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-exp-1206",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 2048, // Adjusted to prevent exceeding limits
  responseMimeType: "text/plain",
};

// Helper function to translate text
async function translateText(text) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(text);
  return result.response.text();
}

app.post('/translate', async (req, res) => {
  const { postTitle, postContent, comments } = req.body;

  if (!postTitle || !postContent || !comments) {
    return res.status(400).json({ error: "Incomplete data provided for translation." });
  }

  try {
    // Translate post title and content
    const translatedPostTitle = await translateText(postTitle);
    const translatedPostContent = await translateText(postContent);

    // Translate each comment
    const translatedComments = [];
    for (let comment of comments) {
      const translatedCommentBody = await translateText(comment.commentBody);
      translatedComments.push({
        author: comment.author,
        commentBody: translatedCommentBody,
      });
    }

    res.json({
      translatedPostTitle,
      translatedPostContent,
      translatedComments,
    });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Translation failed." });
  }
});

app.listen(PORT, () => {
  console.log(`Translation server running on port ${PORT}`);
});
