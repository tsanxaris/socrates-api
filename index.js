import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

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

    console.log(data);

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Error from Gemini";

    res.json({ text });

  } catch (err) {
    console.log(err);
    res.json({ text: "Server error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
