import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// 👉 Παίρνει το key από Render
const API_KEY = process.env.OPENAI_API_KEY;

app.post("/ai", async (req, res) => {
  try {
    const { question, answer } = req.body || {};

    let prompt;

    if (!question) {
      prompt = "Ask a deep Socratic philosophical question.";
    } else {
      prompt = `Question: ${question}\nUser answer: ${answer}\nRespond like Socrates with another question.`;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Socrates." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    console.log(data); // για debug

    if (!data.choices) {
      return res.json({ text: "OpenAI error" });
    }

    const text = data.choices[0].message.content;

    res.json({ text });

  } catch (err) {
    console.log(err);
    res.json({ text: "Server error" });
  }
});

// 👉 Render port
app.listen(process.env.PORT, () => {
  console.log("Server running");
});
