import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "ΒΑΛΕ_ΕΔΩ_ΤΟ_API_KEY_ΣΟΥ";

app.post("/ai", async (req, res) => {
  const { question, answer } = req.body || {};

  let prompt;

  if (!question) {
    prompt = "Ask a deep Socratic question.";
  } else {
    prompt = `Question: ${question}\nUser answer: ${answer}\nRespond like Socrates with another question.`;
  }

  try {
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

    const text = data.choices[0].message.content;

    res.json({ text });

  } catch (err) {
    res.json({ text: "Error talking to AI" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
