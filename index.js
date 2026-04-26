import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// 👉 παίρνει το key από Render
const API_KEY = process.env.GEMINI_API_KEY;

app.post("/ai", async (req, res) => {
  try {
    const { question, answer } = req.body || {};

    let prompt;

    if (!question) {
      prompt = "Ask a deep Socratic philosophical question.";
    } else {
      prompt = `Question: ${question}\nUser answer: ${answer}\nRespond like Socrates with another question.`;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("GEMINI RESPONSE:", data);

    let text = "Error from Gemini";

    if (data.candidates && data.candidates.length > 0) {
      const parts = data.candidates[0].content.parts;

      if (parts && parts.length > 0) {
        text = parts.map(p => p.text).join(" ");
      }
    }

    res.json({ text });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.json({ text: "Server error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
